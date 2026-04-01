import { Component, signal, computed, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowComponent, WindowData } from '../window/window';
import { Taskbar } from '../taskbar/taskbar';
import { TypeText, TypeTextContent } from '../type-text/type-text';
import { WindowType } from '../core/types/windowType.type';

interface DesktopItem {
  id: string;
  name: string;
  type: 'folder' | 'picture' | 'admire';
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
export class DesktopComponent implements AfterViewInit {
  @ViewChild(TypeText) typeTextComponent!: TypeText;

  desktopItems: DesktopItem[] = [
    { id: '1', name: 'Me', type: 'folder', icon: '📁', x: 50, y: 50 },
    { id: '2', name: 'People I admire', type: 'folder', icon: '📁', x: 50, y: 150 },
    { id: '3', name: 'Photos', type: 'folder', icon: '📁', x: 50, y: 250 },
    { id: '4', name: 'Games', type: 'folder', icon: '📁', x: 50, y: 350 },
    { id: '5', name: 'Vacation.jpg', type: 'picture', icon: '🖼️', x: 200, y: 50 },
    { id: '6', name: 'Family.png', type: 'picture', icon: '🖼️', x: 200, y: 150 },
    { id: '7', name: 'Sunset.jpg', type: 'picture', icon: '🖼️', x: 200, y: 250 }
  ];

  typeText: TypeTextContent = {
    fullText: [
      'Hello, I\'m William Lin.',
      'It\'s bored to make a traditional portfolio website.',
      'So I made this OS-in-browser instead!',
      'Enjoy exploring!'
    ],
    textTypeInterval: 100,
    lineTypeInterval: 2500,
    rollbackInterval: 50,
  };

  selectedItem = signal<DesktopItem | null>(null);
  windows = computed(() => this.windowManager.windows());

  private isDraggingItem = false;
  private draggingItemId: string | null = null;
  private dragOffset = { x: 0, y: 0 };

  constructor(private windowManager: WindowManagerService) { }

  isFadedOut = true;

  delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  async ngAfterViewInit() {
    await this.delay(1000);
    this.isFadedOut = false;
    await this.delay(2000);
    this.typeTextComponent.type(true);
  }

  async onTypeFinished() {
    await this.delay(1000);
    this.isFadedOut = true;
  }

  closeNotification() {
    this.isFadedOut = true;
  }

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
    const count = this.windowManager.windows().length;
    const x = 100 + count * 30;
    const y = 100 + count * 30;
    const width = item.type === 'folder' ? 500 : 600;
    const height = item.type === 'folder' ? 400 : 450;
    this.windowManager.openWindow(item.name, item.type, item.name, x, y, width, height);
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

  onNewWindowOpen(payload: { title: string; type: WindowType }): void {
    const count = this.windowManager.windows().length;
    const x = 100 + count * 30;
    const y = 100 + count * 30;
    const width = payload.type === 'folder' ? 500 : 600;
    const height = payload.type === 'folder' ? 400 : 450;
    this.windowManager.openWindow(payload.title, payload.type, payload.title, x, y, width, height);
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
