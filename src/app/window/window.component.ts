import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WindowData {
  id: string;
  title: string;
  type: 'folder' | 'picture';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent {
  @Input() windowData!: WindowData;
  @Output() close = new EventEmitter<string>();
  @Output() focus = new EventEmitter<string>();
  @Output() updatePosition = new EventEmitter<{ id: string; x: number; y: number }>();
  @Output() updateSize = new EventEmitter<{ id: string; width: number; height: number }>();

  isDragging = false;
  isResizing = false;
  dragOffset = { x: 0, y: 0 };
  resizeStart = { x: 0, y: 0, width: 0, height: 0 };

  onWindowClick(): void {
    this.focus.emit(this.windowData.id);
  }

  onClose(): void {
    this.close.emit(this.windowData.id);
  }

  onTitleBarMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.focus.emit(this.windowData.id);
    this.dragOffset = {
      x: event.clientX - this.windowData.x,
      y: event.clientY - this.windowData.y
    };
    event.preventDefault();
  }

  onResizeHandleMouseDown(event: MouseEvent): void {
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

  getFolderFiles(): string[] {
    const folderFiles: { [key: string]: string[] } = {
      'Documents': ['Document1.txt', 'Report.pdf', 'Notes.docx', 'Budget.xlsx'],
      'Pictures': ['Photo1.jpg', 'Photo2.png', 'Photo3.jpg'],
      'Downloads': ['setup.exe', 'archive.zip', 'document.pdf']
    };
    return folderFiles[this.windowData.title] || ['No files'];
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
