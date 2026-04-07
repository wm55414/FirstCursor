import { Injectable } from '@angular/core';
import { FileItem } from '../core/types/FileItem.type';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private readonly rootItems: FileItem[] = [
    {
      id: '2',
      name: 'People I admire',
      type: 'folder',
      icon: '📁',
      x: 50, y: 150,
      children: [
        {
          id: 'admire-1', name: 'Eric Barone.admire', type: 'admire', icon: '📄',
          defaultSize: { width: 800, height: 500 }, x: 50, y: 50
        },
        {
          id: 'admire-2', name: 'Linus Torvalds.admire', type: 'admire', icon: '📄',
          defaultSize: { width: 800, height: 500 }, x: 50, y: 50
        },
      ]
    },
    {
      id: '1',
      name: 'Me',
      type: 'folder',
      icon: '📁',
      x: 50, y: 50,
      children: [
        { id: 'me-1', name: 'Vacation.jpg', type: 'picture', icon: '🖼️' },
        { id: 'me-2', name: 'Family.png', type: 'picture', icon: '🖼️' },
        { id: 'me-3', name: 'Sunset.jpg', type: 'picture', icon: '🖼️' },
        {
          id: 'me-4',
          name: 'Vacation Album',
          type: 'folder',
          icon: '📁',
          children: [
            { id: 'me-4-1', name: 'Beach.png', type: 'picture', icon: '🖼️' },
            { id: 'me-4-2', name: 'Mountains.jpg', type: 'picture', icon: '🖼️' }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Photos',
      type: 'folder',
      icon: '📁',
      x: 50, y: 250,
      children: [
        { id: 'photo-1', name: 'setup.exe', type: 'picture', icon: '🖼️' },
        { id: 'photo-2', name: 'archive.zip', type: 'picture', icon: '🖼️' },
        { id: 'photo-3', name: 'document.pdf', type: 'picture', icon: '🖼️' }
      ]
    },
    { id: '4', name: 'Games', type: 'folder', icon: '📁', x: 50, y: 350, children: [] },
    { id: '5', name: 'Vacation.jpg', type: 'picture', icon: '🖼️', x: 200, y: 50 },
    { id: '6', name: 'Family.png', type: 'picture', icon: '🖼️', x: 200, y: 150 },
    { id: '7', name: 'Sunset.jpg', type: 'picture', icon: '🖼️', x: 200, y: 250 }
  ];

  getFolderItems(path: string[]): FileItem[] {

    if (path.length === 0) {
      return this.rootItems;
    }

    let currentItems: FileItem[] = this.rootItems;

    for (const segment of path) {
      const nextFolder = currentItems.find(
        item => item.type === 'folder' && item.name === segment
      );

      if (!nextFolder || !nextFolder.children) {
        return [];
      }

      currentItems = nextFolder.children;
    }

    return currentItems;
  }
}

