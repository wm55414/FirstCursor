import { Component, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowData } from '../window/window.component';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.css',
})
export class Taskbar implements OnDestroy {
  private timeIntervalId: number | null = null;

  windows = computed<WindowData[]>(() => this.windowManager.windows());

  activeWindowId = computed<string | null>(() => {
    const currentWindows = this.windowManager.windows();
    if (!currentWindows.length) {
      return null;
    }
    const topWindow = currentWindows.reduce((prev, curr) =>
      curr.zIndex > prev.zIndex ? curr : prev
    );
    return topWindow.id;
  });

  currentTime = signal<string>(this.formatTime(new Date()));

  constructor(private windowManager: WindowManagerService) {
    this.timeIntervalId = window.setInterval(() => {
      this.currentTime.set(this.formatTime(new Date()));
    }, 30_000);
  }

  ngOnDestroy(): void {
    if (this.timeIntervalId !== null) {
      window.clearInterval(this.timeIntervalId);
    }
  }

  onTaskClick(id: string): void {
    const currentWindows = this.windowManager.windows();
    const target = currentWindows.find(w => w.id === id);

    if (!target) {
      return;
    }

    // If the window is minimized, restore and focus it
    if (target.isMinimized) {
      this.windowManager.toggleMinimizeWindow(id);
      this.windowManager.focusWindow(id);
      return;
    }

    // If this is the active window, minimize it when clicking again
    if (this.activeWindowId() === id) {
      this.windowManager.toggleMinimizeWindow(id);
      return;
    }

    // Otherwise, just focus it
    this.windowManager.focusWindow(id);
  }

  getWindowIcon(window: WindowData): string {
    return window.type === 'folder' ? '📁' : '🖼️';
  }

  trackByWindowId(_index: number, window: WindowData): string {
    return window.id;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
