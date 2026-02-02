import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowComponent, WindowData } from '../window/window.component';
import { Taskbar } from '../taskbar/taskbar';
import { TypeText, TypeTextContent } from '../type-text/type-text';

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
  imports: [CommonModule, WindowComponent, Taskbar, TypeText],
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

  typeText : TypeTextContent = {
    fullText: [
      'Hello, I\'m William Lin.',
      'It\'s bored to make a traditional portfolio website.',
      'So I made this OS-in-browser instead!',
      'Enjoy exploring!'
    ],
    textTypeInterval: 100,
    lineTypeInterval: 2500,
    rollbackInterval: 50,
    needRollback: false,
  };

  selectedItem = signal<DesktopItem | null>(null);
  windows = computed(() => this.windowManager.windows());

  private isDraggingItem = false;
  private draggingItemId: string | null = null;
  private dragOffset = { x: 0, y: 0 };

  constructor(private windowManager: WindowManagerService) {}

  onItemClick(item: DesktopItem): void {
    if (this.isDraggingItem) {
      return;
    }
    this.selectedItem.set(item);
    console.log(`Clicked: ${item.name} (${item.type})`);
  }

  onItemDoubleClick(item: DesktopItem): void {
    console.log(`Double-clicked: ${item.name}`);
    this.selectedItem.set(null);
    this.windowManager.openWindow(item.name, item.type, item.name);
  }

  onDesktopClick(): void {
    this.selectedItem.set(null);
  }

  onItemMouseDown(event: MouseEvent, item: DesktopItem): void {
    event.stopPropagation();
    this.isDraggingItem = true;
    this.draggingItemId = item.id;
    this.dragOffset = {
      x: event.clientX - item.x,
      y: event.clientY - item.y
    };
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

  onWindowMinimize(id: string): void {
    this.windowManager.toggleMinimizeWindow(id);
  }

  onWindowToggleMaximize(id: string): void {
    this.windowManager.toggleMaximizeWindow(id);
  }

  onOpenPictureFromFolder(payload: { title: string }): void {
    this.windowManager.openWindow(payload.title, 'picture', payload.title);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDraggingItem || !this.draggingItemId) {
      return;
    }

    const desktopRect = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const newX = event.clientX - this.dragOffset.x;
    const newY = event.clientY - this.dragOffset.y;

    const clampedX = Math.max(0, Math.min(newX, desktopRect.width - 80));
    const clampedY = Math.max(0, Math.min(newY, desktopRect.height - 150));

    this.desktopItems = this.desktopItems.map(item =>
      item.id === this.draggingItemId
        ? { ...item, x: clampedX, y: clampedY }
        : item
    );
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDraggingItem = false;
    this.draggingItemId = null;
  }
}
