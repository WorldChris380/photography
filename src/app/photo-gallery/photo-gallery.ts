import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import gallery from '../../assets/gallery.json';

const PAGE_SIZE = 20;

function getFolderPaths(images: { src: string }[]): string[] {
  const folders = new Set<string>();
  images.forEach(img => {
    // Extrahiere den Teil nach "assets/img/photography/"
    const match = img.src.match(/assets\/img\/photography\/(.+)\/[^/]+\.[a-z]+$/i);
    if (match && match[1]) {
      // Alle Zwischenordner als Filter hinzufügen
      const parts = match[1].split('/');
      for (let i = 1; i <= parts.length; i++) {
        folders.add(parts.slice(0, i).join('/'));
      }
    }
  });
  return Array.from(folders).sort();
}

type GalleryImage = { src: string; category: string; description: string };

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrls: ['./photo-gallery.scss'],
})
export class PhotoGallery {
  readonly PAGE_SIZE = PAGE_SIZE;

  images: GalleryImage[] = gallery as GalleryImage[];
  selectedFolder = '';
  currentPath: string[] = [];
  page = 1;
  selectedImageIndex: number | null = null;

  trackBySrc = (_: number, img: GalleryImage) => img.src;

  get filteredImages() {
    if (!this.selectedFolder) return this.images;
    return this.images.filter(img =>
      img.src.includes(`assets/img/photography/${this.selectedFolder}/`)
    );
  }

  get pagedImages() {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filteredImages.slice(start, start + PAGE_SIZE);
  }

  get totalPages() {
    return Math.ceil(this.filteredImages.length / PAGE_SIZE);
  }

  selectFolder(folder: string) {
    this.selectedFolder = folder;
    this.page = 1;
  }

  clearFilter() {
    this.selectedFolder = '';
    this.page = 1;
  }

  goToPage(page: number) {
    this.page = page;
  }

  formatFolderLabel(folder: string): string {
    return folder
      .split('/')
      .map(part =>
        part
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')
      )
      .join(' / ');
  }

  get currentLevelFolders(): string[] {
    // Hole alle Pfade, die auf der aktuellen Ebene liegen
    const prefix = this.currentPath.length
      ? this.currentPath.join('/') + '/'
      : '';
    const level = this.currentPath.length;

    // Alle Ordner, die auf der nächsten Ebene liegen
    const subfolders = new Set<string>();
    this.images.forEach(img => {
      const match = img.src.match(/assets\/img\/photography\/(.+)\/[^/]+\.[a-z]+$/i);
      if (match && match[1]) {
        const parts = match[1].split('/');
        if (
          parts.length > level &&
          (!prefix || match[1].startsWith(prefix))
        ) {
          subfolders.add(parts.slice(0, level + 1).join('/'));
        }
      }
    });
    return Array.from(subfolders)
      .map(f => f.split('/')[level])
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
  }

  goToSubfolder(folder: string) {
    this.currentPath.push(folder);
    this.selectedFolder = this.currentPath.join('/');
    this.page = 1;
  }

  goUpOneLevel() {
    this.currentPath.pop();
    this.selectedFolder = this.currentPath.join('/');
    this.page = 1;
  }

  clearAllFilters() {
    this.currentPath = [];
    this.selectedFolder = '';
    this.page = 1;
  }

  openLightbox(index: number) {
    this.selectedImageIndex = index;
  }

  closeLightbox() {
    this.selectedImageIndex = null;
  }

  prevImage() {
    if (this.selectedImageIndex !== null && this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }

  nextImage() {
    if (
      this.selectedImageIndex !== null &&
      this.selectedImageIndex < this.filteredImages.length - 1
    ) {
      this.selectedImageIndex++;
    }
  }

  get lightboxImage() {
    return this.selectedImageIndex !== null
      ? this.filteredImages[this.selectedImageIndex]
      : null;
  }

  getCurrentFolderPath(folder: string): string {
    return this.currentPath.concat(folder).join('/');
  }
}