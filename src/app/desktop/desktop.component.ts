import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowComponent, WindowData } from '../window/window.component';

interface DesktopItem {
  id: string;
  name: string;
  type: 'folder' | 'picture';
  icon: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})
export class DesktopComponent {
  desktopItems: DesktopItem[] = [
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      icon: '📁',
      x: 50,
      y: 50
    },
    {
      id: '2',
      name: 'Pictures',
      type: 'folder',
      icon: '📁',
      x: 50,
      y: 150
    },
    {
      id: '3',
      name: 'Downloads',
      type: 'folder',
      icon: '📁',
      x: 50,
      y: 250
    },
    {
      id: '4',
      name: 'Vacation.jpg',
      type: 'picture',
      icon: '🖼️',
      x: 200,
      y: 50
    },
    {
      id: '5',
      name: 'Family.png',
      type: 'picture',
      icon: '🖼️',
      x: 200,
      y: 150
    },
    {
      id: '6',
      name: 'Sunset.jpg',
      type: 'picture',
      icon: '🖼️',
      x: 200,
      y: 250
    }
  ];

  selectedItem = signal<DesktopItem | null>(null);
  windows = computed(() => this.windowManager.windows());

  constructor(private windowManager: WindowManagerService) {}

  onItemClick(item: DesktopItem): void {
    this.selectedItem.set(item);
    console.log(`Clicked: ${item.name} (${item.type})`);
  }

  onItemDoubleClick(item: DesktopItem): void {
    console.log(`Double-clicked: ${item.name}`);
    this.selectedItem.set(item);
    this.windowManager.openWindow(item.name, item.type, item.name);
  }

  onDesktopClick(): void {
    this.selectedItem.set(null);
  }

  onWindowClose(id: string): void {
    this.windowManager.closeWindow(id);
  }

  onWindowFocus(id: string): void {
    this.windowManager.focusWindow(id);
  }

  onWindowPositionUpdate(data: { id: string; x: number; y: number }): void {
    this.windowManager.updateWindowPosition(data.id, data.x, data.y);
  }

  onWindowSizeUpdate(data: { id: string; width: number; height: number }): void {
    this.windowManager.updateWindowSize(data.id, data.width, data.height);
  }
}
