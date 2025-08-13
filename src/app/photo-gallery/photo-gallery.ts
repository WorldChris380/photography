import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

const JSON_BASE = 'assets/';

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
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './photo-gallery.html',
  styleUrls: ['./photo-gallery.scss'],
})
export class PhotoGallery implements OnInit {
  images: any[] = [];
  // Ladeanzeige entfernt
  readonly PAGE_SIZE = 20;

  selectedFolder = '';
  currentPath: string[] = [];
  page = 1;
  selectedImageIndex: number | null = null;
  searchTerm = '';
  private _filteredImages: GalleryImage[] = this.images;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.selectedFolder = params['filter'];
        this.currentPath = params['filter'].split('/');
        this.page = 1;
      }
    });
  }

  trackBySrc = (_: number, img: GalleryImage) => img.src;

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this._filteredImages = this.images;
      return;
    }
    this._filteredImages = this.images.filter(img => {
      // Beschreibung durchsuchen
      const desc = img.description.toLowerCase();
      // Vollständigen Pfad durchsuchen
      const fullPath = img.src.toLowerCase();
      // Nur Dateiname extrahieren
      const fileName = img.src.split('/').pop()?.toLowerCase() || '';
      // Ordnernamen extrahieren (ohne Dateiname)
      const folderPath = img.src
        .replace(/^assets\/img\/photography\//i, '')
        .split('/')
        .slice(0, -1)
        .join('/')
        .toLowerCase();

      return (
        desc.includes(term) ||
        fullPath.includes(term) ||
        fileName.includes(term) ||
        folderPath.includes(term)
      );
    });
    this.page = 1;
  }

  get filteredImages() {
    if (this.selectedFolder) {
      return this._filteredImages.filter(img => {
        // Extrahiere den Ordnerpfad aus dem Bild
        const folderPath = img.src
          .replace(/^assets\/img\/photography\//i, '')
          .split('/')
          .slice(0, -1)
          .join('/')
          .toLowerCase();
        // Zeige Bilder aus dem gewählten Ordner und allen Unterordnern
        return folderPath === this.selectedFolder.toLowerCase() ||
               folderPath.startsWith(this.selectedFolder.toLowerCase() + '/');
      });
    }
    return this._filteredImages;
  }

  get pagedImages() {
    const start = (this.page - 1) * this.PAGE_SIZE;
    return this.filteredImages.slice(start, start + this.PAGE_SIZE);
  }

  get totalPages() {
    return Math.ceil(this.filteredImages.length / this.PAGE_SIZE);
  }

  get paginationPages(): number[] {
    const total = this.totalPages;
    const current = this.page;
    const maxButtons = 30;
    const sideButtons = 14;

    let start = Math.max(1, current - sideButtons);
    let end = Math.min(total, current + sideButtons);

    // Falls wir am Anfang oder Ende sind, auf 30 Buttons auffüllen
    if (end - start + 1 < maxButtons) {
      if (start === 1) {
        end = Math.min(total, start + maxButtons - 1);
      } else if (end === total) {
        start = Math.max(1, end - maxButtons + 1);
      }
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
          .map((word, i) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(' ')
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
    // Statt nur den Namen anhängen, den vollständigen Pfad setzen
    if (this.currentPath.length) {
      this.currentPath.push(folder);
    } else {
      this.currentPath = [folder];
    }
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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.selectedImageIndex !== null) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      }
    }
  }

  async ngOnInit() {
    try {
      const allImages = await fetch(JSON_BASE + 'gallery.json').then(res => res.json());
      // Duplikate entfernen (optional)
      const seen = new Set();
      this.images = allImages.filter((img: any) => {
        const key = img.src || img.description;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      this._filteredImages = this.images; // <--- HIER HINZUFÜGEN
    } catch (e) {
      this.images = [];
      this._filteredImages = [];
    }
  }
}