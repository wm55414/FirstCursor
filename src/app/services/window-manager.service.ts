import { Injectable, signal } from '@angular/core';
import { WindowData } from '../window/window.component';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private nextZIndex = 1000;
  windows = signal<WindowData[]>([]);

  openWindow(title: string, type: 'folder' | 'picture', content: string): string {
    const id = `window-${Date.now()}-${Math.random()}`;
    const newWindow: WindowData = {
      id,
      title,
      type,
      content,
      x: 100 + this.windows().length * 30,
      y: 100 + this.windows().length * 30,
      width: type === 'folder' ? 500 : 600,
      height: type === 'folder' ? 400 : 450,
      zIndex: this.nextZIndex++
    };

    this.windows.update(windows => [...windows, newWindow]);
    return id;
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
}
