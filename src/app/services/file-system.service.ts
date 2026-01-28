import { Injectable } from '@angular/core';

export interface FileItem {
  name: string;
  type: 'folder' | 'picture';
  children?: FileItem[];
}

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private readonly rootItems: FileItem[] = [
    {
      name: 'Documents',
      type: 'folder',
      children: [
        { name: 'Document1.txt', type: 'picture' },
        { name: 'Report.pdf', type: 'picture' },
        {
          name: 'Work',
          type: 'folder',
          children: [
            { name: 'ProjectPlan.docx', type: 'picture' },
            { name: 'Budget.xlsx', type: 'picture' }
          ]
        }
      ]
    },
    {
      name: 'Pictures',
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
      name: 'Downloads',
      type: 'folder',
      children: [
        { name: 'setup.exe', type: 'picture' },
        { name: 'archive.zip', type: 'picture' },
        { name: 'document.pdf', type: 'picture' }
      ]
    }
  ];

  getRootItems(): FileItem[] {
    return this.rootItems;
  }

  getFolderItems(path: string[]): FileItem[] {
    if (!path.length) {
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

