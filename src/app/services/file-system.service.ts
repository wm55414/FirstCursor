import { Injectable } from '@angular/core';

export interface FileItem {
  name: string;
  type: 'folder' | 'picture' | 'admire';
  children?: FileItem[];
}

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private readonly rootItems: FileItem[] = [
    {
      name: 'People I admire',
      type: 'folder',
      children: [
        { name: 'Eric Barone.admire', type: 'admire' },
        { name: 'Linus Torvalds.admire', type: 'admire' },
      ]
    },
    {
      name: 'Me',
      type: 'folder',
      children: [
        { name: 'Vacation.jpg', type: 'picture' },
        { name: 'Family.png', type: 'picture' },
        { name: 'Sunset.jpg', type: 'picture' },
        {
          name: 'Vacation Album',
          type: 'folder',
          children: [
            { name: 'Beach.png', type: 'picture' },
            { name: 'Mountains.jpg', type: 'picture' }
          ]
        }
      ]
    },
    {
      name: 'Photos',
      type: 'folder',
      children: [
        { name: 'setup.exe', type: 'picture' },
        { name: 'archive.zip', type: 'picture' },
        { name: 'document.pdf', type: 'picture' }
      ]
    }
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

