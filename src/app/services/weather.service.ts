import { Injectable, signal } from '@angular/core';

export interface WeatherData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    label: string;
    icon: string;
    image: string;
}

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private readonly TAIPEI_LAT = 25.0330;
    private readonly TAIPEI_LON = 121.5654;
    private readonly API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${this.TAIPEI_LAT}&longitude=${this.TAIPEI_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FTaipei`;

    currentWeather = signal<WeatherData | null>(null);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    async fetchWeather(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            const current = data.current;

            const weatherInfo = this.mapWeatherCode(current.weather_code);

            this.currentWeather.set({
                temperature: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                windSpeed: current.wind_speed_10m,
                weatherCode: current.weather_code,
                label: weatherInfo.label,
                icon: weatherInfo.icon,
                image: weatherInfo.image
            });
        } catch (err) {
            this.error.set(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            this.loading.set(false);
        }
    }

    private mapWeatherCode(code: number): { label: string; icon: string; image: string } {
        if (code === 0) return { label: 'Clear sky', icon: '☀️', image: 'assets/weather/sunny.png' };
        if (code >= 1 && code <= 3) return { label: 'Partly cloudy', icon: '⛅', image: 'assets/weather/cloudy.png' };
        if (code === 45 || code === 48) return { label: 'Foggy', icon: '🌫️', image: 'assets/weather/cloudy.png' };
        if (code >= 51 && code <= 55) return { label: 'Drizzle', icon: '🌦️', image: 'assets/weather/rainy.png' };
        if (code >= 61 && code <= 65) return { label: 'Rain', icon: '🌧️', image: 'assets/weather/rainy.png' };
        if (code >= 71 && code <= 75) return { label: 'Snow', icon: '❄️', image: 'assets/weather/cloudy.png' };
        if (code >= 80 && code <= 82) return { label: 'Rain showers', icon: '🌦️', image: 'assets/weather/rainy.png' };
        if (code === 95 || code >= 96) return { label: 'Thunderstorm', icon: '⛈️', image: 'assets/weather/stormy.png' };
        return { label: 'Cloudy', icon: '☁️', image: 'assets/weather/cloudy.png' };
    }
}
