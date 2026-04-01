import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem, FileSystemService } from '../services/file-system.service';
import { WeatherComponent } from '../weather/weather';
import { Admire } from '../admire/admire';
import { WindowType } from '../core/types/windowType.type';

export interface WindowData {
  id: string;
  title: string;
  type: WindowType;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  restoreBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule, WeatherComponent, Admire],
  templateUrl: './window.html',
  styleUrls: ['./window.css']
})
export class WindowComponent implements OnInit {
  @Input() windowData!: WindowData;
  @Output() close = new EventEmitter<string>();
  @Output() focus = new EventEmitter<string>();
  @Output() updatePosition = new EventEmitter<{ id: string; x: number; y: number }>();
  @Output() updateSize = new EventEmitter<{ id: string; width: number; height: number }>();
  @Output() minimize = new EventEmitter<string>();
  @Output() toggleMaximize = new EventEmitter<string>();
  @Output() openWindow = new EventEmitter<{ title: string; type: WindowType }>();

  isDragging = false;
  isResizing = false;
  dragOffset = { x: 0, y: 0 };
  resizeStart = { x: 0, y: 0, width: 0, height: 0 };

  currentFolderPath: string[] = [];

  constructor(private fileSystem: FileSystemService) { }

  ngOnInit(): void {
    if (this.windowData.type === 'folder') {
      this.currentFolderPath = [this.windowData.title];
    }
  }

  navigateBack(): void {
    if (this.currentFolderPath.length > 1) {
      this.currentFolderPath.pop();
      this.currentFolderPath = [...this.currentFolderPath];
    }
  }

  navigateUp(): void {
    if (this.currentFolderPath.length > 1) {
      this.currentFolderPath.pop();
      this.currentFolderPath = [...this.currentFolderPath];
    }
  }

  refreshFolder(): void {
    this.currentFolderPath = [...this.currentFolderPath];
  }

  onWindowClick(): void {
    this.focus.emit(this.windowData.id);
  }

  onClose(): void {
    this.close.emit(this.windowData.id);
  }

  onMinimize(event: MouseEvent): void {
    event.stopPropagation();
    this.minimize.emit(this.windowData.id);
  }

  onToggleMaximize(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleMaximize.emit(this.windowData.id);
  }

  onTitleBarMouseDown(event: MouseEvent): void {
    if (this.windowData.isMaximized) {
      return;
    }
    this.isDragging = true;
    this.focus.emit(this.windowData.id);
    this.dragOffset = {
      x: event.clientX - this.windowData.x,
      y: event.clientY - this.windowData.y
    };
    event.preventDefault();
  }

  onResizeHandleMouseDown(event: MouseEvent): void {
    if (this.windowData.isMaximized) {
      return;
    }
    this.isResizing = true;
    this.focus.emit(this.windowData.id);
    this.resizeStart = {
      x: event.clientX,
      y: event.clientY,
      width: this.windowData.width,
      height: this.windowData.height
    };
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const newX = event.clientX - this.dragOffset.x;
      const newY = event.clientY - this.dragOffset.y;
      this.updatePosition.emit({
        id: this.windowData.id,
        x: Math.max(0, Math.min(newX, window.innerWidth - 200)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 100))
      });
    }
    if (this.isResizing) {
      const newWidth = Math.max(300, this.resizeStart.width + (event.clientX - this.resizeStart.x));
      const newHeight = Math.max(200, this.resizeStart.height + (event.clientY - this.resizeStart.y));
      this.updateSize.emit({
        id: this.windowData.id,
        width: Math.min(newWidth, window.innerWidth - this.windowData.x),
        height: Math.min(newHeight, window.innerHeight - this.windowData.y)
      });
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.isResizing = false;
  }

  getCurrentFolderItems(): FileItem[] {
    if (this.windowData.type !== 'folder') {
      return [];
    }
    return this.fileSystem.getFolderItems(this.currentFolderPath);
  }

  onFolderItemDoubleClick(item: FileItem): void {
    if (item.type === 'folder') {
      this.currentFolderPath = [...this.currentFolderPath, item.name];
      return;
    }

    if (item.type === 'picture' || item.type === 'admire') {
      this.openWindow.emit({ title: item.name, type: item.type });
    }
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: string } = {
      'txt': '📄',
      'pdf': '📕',
      'docx': '📘',
      'xlsx': '📗',
      'jpg': '🖼️',
      'png': '🖼️',
      'exe': '⚙️',
      'zip': '📦'
    };
    return iconMap[extension || ''] || '📄';
  }

  getPictureEmoji(): string {
    const emojiMap: { [key: string]: string } = {
      'Vacation.jpg': '🏖️',
      'Family.png': '👨‍👩‍👧‍👦',
      'Sunset.jpg': '🌅'
    };
    return emojiMap[this.windowData.title] || '🖼️';
  }
}
