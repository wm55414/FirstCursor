export interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'picture' | 'admire';
    icon: string;
    x?: number;
    y?: number;
    children?: FileItem[];
    defaultSize?: { width: number, height: number };
}