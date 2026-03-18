import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';

@Component({
    selector: 'app-weather',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './weather.html',
    styleUrl: './weather.css'
})
export class WeatherComponent implements OnInit {
    constructor(public weatherService: WeatherService) { }

    ngOnInit(): void {
        this.weatherService.fetchWeather();
    }

    refresh(): void {
        this.weatherService.fetchWeather();
    }
}
