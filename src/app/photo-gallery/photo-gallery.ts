import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SeoService } from '../seo-service/seo-service';
import { PaypalService } from '../paypal/paypal.service';
import { DEFAULT_PHOTO_PRICE_EUR } from '../paypal/payments.config';
import { AppComponent } from '../app';

const JSON_BASE = 'assets/';

type GalleryImage = { src: string; category: string; description: string };

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './photo-gallery.html',
  styleUrls: ['./photo-gallery.scss'],
})
export class PhotoGallery implements OnInit {
  images: GalleryImage[] = [];
  readonly PAGE_SIZE = 20;

  selectedFolder = '';
  currentPath: string[] = [];
  page = 1;
  selectedImageIndex: number | null = null;
  searchTerm = '';
  private _filteredImages: GalleryImage[] = [];
  filter = '';

  @ViewChild('lightboxContainer') lightboxContainer?: ElementRef<HTMLElement>;
  @ViewChild('lightboxCloseBtn') lightboxCloseBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('paypalButtons') paypalButtons?: ElementRef<HTMLDivElement>;

  purchaseVisible = false;
  defaultPrice = DEFAULT_PHOTO_PRICE_EUR;
  showDownloadCta = false;
  accountDownloadsUrl = '/account#downloads';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private seo: SeoService,
    private paypal: PaypalService,
    private app: AppComponent) {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.selectedFolder = params['filter'];
        this.currentPath = params['filter'].split('/');
        this.filter = params['filter'];
        this.page = 1;
        this._updateFilteredImages();
      } else {
        this.selectedFolder = 'root'; // Standardwert setzen
        this.currentPath = ['root'];
      }
    });
  }

  private _updateFilteredImages() {
    if (!this.filter || this.filter.toLowerCase() === 'all') {
      this._filteredImages = this.images;
      return;
    }

    this._filteredImages = this.images.filter(img => {
      const imgPath = img.src.toLowerCase();
      const filterPath = this.filter.toLowerCase();

      // Check if image path contains either Aviation or Travel based on filter
      if (filterPath === 'aviation') {
        return imgPath.includes('/aviation/');
      }
      if (filterPath === 'travel') {
        return imgPath.includes('/travel/');
      }

      return false;
    });
  }

  private _updateActiveFolderBasedOnImages(): void {
    if (this._filteredImages.length > 0) {
      const firstImagePath = this._filteredImages[0].src;
      const match = firstImagePath.match(/assets\/img\/photography\/(.+?)\//);
      if (match && match[1]) {
        const folderPath = match[1];
        this.selectedFolder = folderPath;
        this.currentPath = folderPath.split('/');
      }
    }
  }

  getVisibleFolders(): { parent?: string; current: string; children: string[] } {
    const level = this.currentPath.length;
    const parentFolder = level > 1 ? this.currentPath.slice(0, level - 1).join('/') : undefined;
    const currentFolder = this.currentPath.slice(-1).join('/');
    const childFolders = this.currentLevelFolders;

    return { parent: parentFolder, current: currentFolder, children: childFolders };
  }

  trackBySrc = (_: number, img: GalleryImage) => img.src;

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this._filteredImages = this.images;
      this.page = 1;
      return;
    }

    this._filteredImages = this.images.filter(img => {
      const desc = img.description.toLowerCase();
      const fullPath = img.src.toLowerCase();
      const fileName = img.src.split('/').pop()?.toLowerCase() || '';
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
    if (!this.selectedFolder || this.selectedFolder.toLowerCase() === 'all') {
      return this._filteredImages; // Return all images when no filter or "All" selected
    }
    return this._filteredImages.filter(img => {
      const folderPath = img.src
        .replace(/^assets\/img\/photography\//i, '')
        .split('/')
        .slice(0, -1)
        .join('/')
        .toLowerCase();

      const filterPath = this.selectedFolder.toLowerCase();
      return folderPath === filterPath ||
        folderPath.startsWith(filterPath + '/');
    });
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

  // Modify selectFolder to use router navigation
  selectFolder(folder: string) {
    // Navigate with new filter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: folder },
      queryParamsHandling: 'merge'
    });
  }

  clearFilter() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: 'all' }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
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
    const level = this.currentPath.length;
    const prefix = this.currentPath.length ? this.currentPath.join('/') + '/' : '';

    const subfolders = new Set<string>();
    this.images.forEach(img => {
      const match = img.src.match(/assets\/img\/photography\/(.+)\/[^/]+\.[a-z]+$/i);
      if (match && match[1]) {
        const parts = match[1].split('/');
        if (parts.length > level && (!prefix || match[1].startsWith(prefix))) {
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
    if (this.currentPath.length) {
      this.currentPath.push(folder);
    } else {
      this.currentPath = [folder];
    }
    this.selectedFolder = this.currentPath.join('/');
    this.filter = this.selectedFolder;
    this.page = 1;
  }

  goUpOneLevel() {
    this.currentPath.pop();
    this.selectedFolder = this.currentPath.join('/');
    this.filter = this.selectedFolder;
    this.page = 1;
  }

  clearAllFilters() {
    this.currentPath = [];
    this.selectedFolder = '';
    this.page = 1;
  }

  openLightbox(index: number) {
    this.selectedImageIndex = index;
    this.purchaseVisible = false;
    // Focus the lightbox close button for accessibility after view updates
    setTimeout(() => {
      if (this.lightboxCloseBtn?.nativeElement) {
        this.lightboxCloseBtn.nativeElement.focus();
      } else if (this.lightboxContainer?.nativeElement) {
        this.lightboxContainer.nativeElement.focus();
      }
    });
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

  get lightboxImagePath() {
    if (this.selectedImageIndex === null) return '';
    const img = this.filteredImages[this.selectedImageIndex];
    if (!img || !img.src) return '';
    
    // Extract folder path from src (e.g., "assets/img/photography/Aviation/Africa/Cape Verde/...")
    // Remove "assets/img/photography/" prefix and filename
    const pathMatch = img.src.match(/assets\/img\/photography\/(.+?)\/[^\/]+$/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
    
    // Fallback: try to get from category field if it exists
    return (img as any).category || '';
  }

  onLightboxKeydown(event: KeyboardEvent) {
    if (!this.lightboxContainer) return;
    if (event.key !== 'Tab') return;
    const container = this.lightboxContainer.nativeElement;
    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea', 'input[type="text"]', 'input[type="radio"]', 'input[type="checkbox"]', 'select', '[tabindex]:not([tabindex="-1"])'
    ].join(',');
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
      .filter(el => el.offsetParent !== null || el === document.activeElement);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  async togglePurchase() {
    this.purchaseVisible = !this.purchaseVisible;
    if (!this.purchaseVisible) return;
    try {
      const paypal = await this.paypal.load();
      const container = this.paypalButtons?.nativeElement;
      if (!container) return;
      // Clear any previous buttons
      container.innerHTML = '';
      // Render buttons
      const img = this.lightboxImage;
      const description = img ? img.description : 'Photo purchase';
      const customId = img ? img.src : 'photo';
      paypal.Buttons({
        createOrder: async (_data: any, _actions: any) => {
          try {
            const res = await fetch('https://photography.christian-boehme.com/create-order.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ src: customId, description })
            });
            const text = await res.text();
            let data: any;
            try {
              data = JSON.parse(text);
            } catch (e) {
              console.error('Server returned non-JSON:', text.substring(0, 200));
              this.app.showNotification('Server error. Please try again later.', 'error');
              throw new Error('Invalid server response');
            }
            if (!res.ok || !data?.id) {
              console.error('Create order error:', data);
              this.app.showNotification(`Payment error: ${data?.error || 'Unknown'}`, 'error');
              throw new Error('Create order failed');
            }
            return data.id;
          } catch (e: any) {
            console.error('Create order exception:', e);
            if (!e.message?.includes('order failed')) {
              this.app.showNotification('Network error. Please check your connection.', 'error');
            }
            throw e;
          }
        },
        onApprove: async (data: any, _actions: any) => {
          try {
            const res = await fetch('https://photography.christian-boehme.com/capture-order.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID })
            });
            const cap = await res.json();
            if (!res.ok) throw new Error('Capture failed');
            this.app.showNotification('Danke! Dein Kauf war erfolgreich. Du kannst deine Dateien jetzt herunterladen.', 'success');
            // Zeige dezente Download-CTA statt Panel zu schließen
            this.showDownloadCta = true;
          } catch (e) {
            this.app.showNotification('Payment capture failed. Please contact support.', 'error');
          }
        },
        onError: (err: any) => {
          console.error('PayPal error', err);
          this.app.showNotification('PayPal error. Please try again later.', 'error');
        }
      }).render(container);
    } catch (e) {
      console.error('Failed to load PayPal SDK', e);
      this.app.showNotification('Could not load payment options. Please try again later.', 'error');
    }
  }

  getCurrentFolderPath(folder: string): string {
    return this.currentPath.concat(folder).join('/');
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.selectedImageIndex !== null) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        this.prevImage();
      } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        this.nextImage();
      }
    }
  }

  async ngOnInit() {
    try {
      const allImages = await fetch(JSON_BASE + 'gallery.json').then(res => res.json());
      const seen = new Set();
      this.images = allImages.filter((img: any) => {
        const key = img.src || img.description;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      this._updateFilteredImages(); // Apply initial filter
    } catch (e) {
      this.images = [];
    }

    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || '';
      const title = this.filter ? `Christian Böhme Photography - ${this.filter}` : 'Gallery';
      const desc = this.filter ? `Photos filtered by ${this.filter}` : 'All photos';
      this.seo.setTitle(title);
      this.seo.setDescription(desc);
      this.seo.setCanonical(window.location.origin + '/gallery' + (this.filter ? `?filter=${encodeURIComponent(this.filter)}` : ''));
      this.seo.setJsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": desc,
        "url": window.location.origin + '/gallery' + (this.filter ? `?filter=${encodeURIComponent(this.filter)}` : '')
      });
    });
  }

  navigateToDownloads() {
    this.router.navigate([this.accountDownloadsUrl]);
  }

  isActiveFolder(folder: string): boolean {
    // Check if the folder is the last part of the current path (current folder name)
    const currentFolderName = this.currentPath[this.currentPath.length - 1];
    return currentFolderName?.toLowerCase() === folder.toLowerCase();
  }
}

function getFolderPaths(images: { src: string }[]): string[] {
  const folders = new Set<string>();
  images.forEach(img => {
    const match = img.src.match(/assets\/img\/photography\/(.+)\/[^/]+\.[a-z]+$/i);
    if (match && match[1]) {
      const parts = match[1].split('/');
    }
  });
  return Array.from(folders).sort();
}