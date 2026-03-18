import { Injectable, signal } from '@angular/core';
import { WindowData } from '../window/window';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private nextZIndex = 1000;
  windows = signal<WindowData[]>([]);

  openWindow(title: string, type: 'folder' | 'picture' | 'weather', content: string, x: number, y: number, width: number, height: number): string {
    const id = type === 'weather' ? 'weather-window' : `window-${Date.now()}-${Math.random()}`;
    const existing = this.windows().find(w => w.id === id);
    if (existing) {
      if (existing.isMinimized) {
        this.toggleMinimizeWindow(id);
      }
      this.focusWindow(id);
      return id;
    }

    const newWindow: WindowData = {
      id,
      title,
      type,
      content,
      x,
      y,
      width,
      height,
      zIndex: this.nextZIndex++,
      isMinimized: false,
      isMaximized: false
    };

    this.windows.update(windows => [...windows, newWindow]);
    return id;
  }

  toggleWeatherWindow(): void {
    const id = 'weather-window';
    const existing = this.windows().find(w => w.id === id);
    if (existing) {
      if (existing.isMinimized) {
        this.toggleMinimizeWindow(id);
        this.focusWindow(id);
      } else {
        // If it's the top window, minimize it. Otherwise, focus it.
        const topWindow = this.windows().reduce((prev, curr) => curr.zIndex > prev.zIndex ? curr : prev);
        if (topWindow.id === id) {
          this.toggleMinimizeWindow(id);
        } else {
          this.focusWindow(id);
        }
      }
    } else {
      const width = 450;
      const height = 500;
      const x = (window.innerWidth - width) / 2;
      const y = (window.innerHeight - height) / 2;
      this.openWindow('Weather', 'weather', '', x, y, width, height);
    }
  }

  closeWindow(id: string): void {
    this.windows.update(windows => windows.filter(w => w.id !== id));
  }

  focusWindow(id: string): void {
    this.windows.update(windows => windows.map(w => {
      if (w.id === id) {
        return { ...w, zIndex: this.nextZIndex++ };
      }
      return w;
    }));
  }

  updateWindowPosition(id: string, x: number, y: number): void {
    this.windows.update(windows => windows.map(w => {
      if (w.id === id) {
        return { ...w, x, y };
      }
      return w;
    }));
  }

  updateWindowSize(id: string, width: number, height: number): void {
    this.windows.update(windows => windows.map(w => {
      if (w.id === id) {
        return { ...w, width, height };
      }
      return w;
    }));
  }

  toggleMinimizeWindow(id: string): void {
    this.windows.update(windows =>
      windows.map(w => {
        if (w.id === id) {
          return {
            ...w,
            isMinimized: !w.isMinimized
          };
        }
        return w;
      })
    );
  }

  toggleMaximizeWindow(id: string): void {
    const taskbarHeight = 44;

    this.windows.update(windows =>
      windows.map(w => {
        if (w.id !== id) {
          return w;
        }

        if (!w.isMaximized) {
          const restoreBounds = {
            x: w.x,
            y: w.y,
            width: w.width,
            height: w.height
          };

          return {
            ...w,
            isMaximized: true,
            isMinimized: false,
            restoreBounds,
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - taskbarHeight
          };
        } else if (w.restoreBounds) {
          return {
            ...w,
            isMaximized: false,
            ...w.restoreBounds,
            restoreBounds: undefined
          };
        }

        return w;
      })
    );
  }
}
