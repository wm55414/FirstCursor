import { Component, signal, computed, HostListener, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowComponent, WindowData } from '../window/window';
import { Taskbar } from '../taskbar/taskbar';
import { TypeText, TypeTextContent } from '../type-text/type-text';
import { WindowType } from '../core/types/windowType.type';
import { FileItem } from '../core/types/FileItem.type';

import { FileSystemService } from '../services/file-system.service';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, WindowComponent, Taskbar, TypeText],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})
export class DesktopComponent implements AfterViewInit, OnInit {
  @ViewChild(TypeText) typeTextComponent!: TypeText;

  desktopItems: FileItem[] = [];

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

  selectedItem = signal<FileItem | null>(null);
  windows = computed(() => this.windowManager.windows());

  private isDraggingItem = false;
  private draggingItemId: string | null = null;
  private dragOffset = { x: 0, y: 0 };

  constructor(private windowManager: WindowManagerService, private fileSystem: FileSystemService) { }

  ngOnInit() {
    this.desktopItems = this.fileSystem.getFolderItems([]);
  }

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

  onItemClick(item: FileItem): void {
    if (this.isDraggingItem) {
      return;
    }
    this.selectedItem.set(item);
    console.log(`Clicked: ${item.name} (${item.type})`);
  }

  onItemDoubleClick(item: FileItem): void {
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

  onItemMouseDown(event: MouseEvent, item: FileItem): void {
    event.stopPropagation();
    this.isDraggingItem = true;
    this.draggingItemId = item.id;
    this.dragOffset = {
      x: event.clientX - (item.x || 0),
      y: event.clientY - (item.y || 0)
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

  onNewWindowOpen(payload: FileItem): void {
    const count = this.windowManager.windows().length;
    const x = payload.x || 100 + count * 30;
    const y = payload.y || 100 + count * 30;
    const width = payload.defaultSize?.width || 600;
    const height = payload.defaultSize?.height || 450;
    this.windowManager.openWindow(payload.name, payload.type, payload.name, x, y, width, height);
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
