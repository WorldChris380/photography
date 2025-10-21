import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeNumbers } from '../home-numbers/home-numbers';
import { CountriesVisited } from '../countries-visited/countries-visited';
import { SeoService } from '../seo-service/seo-service';

@Component({
  selector: 'app-photography-home',
  templateUrl: './photography-home.html',
  styleUrls: ['./photography-home.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, HomeNumbers, CountriesVisited]
})
export class PhotographyHome implements OnInit, OnDestroy {
  atfImages: string[] = [
    'assets/img/photography/Travel/North America/Costa Rica/2024.06.02 So Butterfly Garden, La Fortuna Hotel/Tropic vulcano Arenal view from La Fortuna .jpg',
    'assets/img/photography/Travel/North America/Costa Rica/2024.06.03 Mo La Fortuna Hot Springs Tabacon/Tropical paradise hot springs Tabacon Resort .jpg',
    'assets/img/photography/Travel/North America/Costa Rica/2024.06.03 Mo La Fortuna Hot Springs Tabacon/Lake Arenal in the middle of tropical Costa Rica .jpg'
  ];
  atfIndex = 0;

  private slideIntervalId?: number;

  aviationCount = 0;
  travelCount = 0;
  gallery: any[] = [];
  isTransitioning = false;

  constructor(
    private seo: SeoService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const title = 'Photography by Christian Böhme';
    const desc = 'Collection of aviation and travel photography. Explore galleries and countries visited.';
    this.seo.setTitle(title);
    this.seo.setDescription(desc);
    this.seo.setCanonical(window.location.origin + window.location.pathname);
    this.seo.setJsonLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Photography",
      "url": window.location.origin + '/'
    });

    // Starte automatischen Bildwechsel
    this.startAutoSlide();

    this.http.get<any[]>('assets/gallery.json').subscribe(data => {
      this.gallery = data;
      this.aviationCount = this.gallery.filter(
        img => img.category && img.category.toLowerCase() === 'aviation'
      ).length;
      this.travelCount = this.gallery.filter(
        img => img.category && img.category.toLowerCase() === 'travel'
      ).length;
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  private startAutoSlide(intervalMs = 5000) {
    this.stopAutoSlide();
    if (!this.atfImages || this.atfImages.length === 0) return;
    this.slideIntervalId = window.setInterval(() => {
      this.nextImage();
    }, intervalMs) as unknown as number;
  }

  private nextImage() {
    this.isTransitioning = true;
    setTimeout(() => {
      this.atfIndex = (this.atfIndex + 1) % this.atfImages.length;
      this.isTransitioning = false;
    }, 800); // volle Animationsdauer
  }

  selectImage(index: number) {
    this.isTransitioning = true;
    setTimeout(() => {
      this.atfIndex = index;
      this.isTransitioning = false;
      this.startAutoSlide();
    }, 800);
  }

  private stopAutoSlide() {
    if (this.slideIntervalId != null) {
      clearInterval(this.slideIntervalId);
      this.slideIntervalId = undefined;
    }
  }

  getTransform(): string {
    return `translateX(-${this.atfIndex * 100}%)`;
  }
}