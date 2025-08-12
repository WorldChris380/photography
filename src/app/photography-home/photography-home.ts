import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import gallery from '../../assets/gallery.json';

@Component({
  selector: 'app-photography-home',
  templateUrl: './photography-home.html',
  styleUrls: ['./photography-home.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PhotographyHome {
  atfImages = [
    'assets/img/photography/travel/north-america/costa-rica/Costa Rica Hot Springs Tabacon.jpg',
    'assets/img/photography/travel/australia-oceania/australia/Outback Australia.jpg',
    'assets/img/photography/travel/europe/belarus/Mir Castle Belarus.jpg'
  ];
  atfIndex = 0;

  aviationCount = 0;
  travelCount = 0;

  ngOnInit() {
    this.aviationCount = gallery.filter(img => img.category.toLowerCase() === 'aviation').length;
    this.travelCount = gallery.filter(img => img.category.toLowerCase() === 'travel').length;

    setInterval(() => {
      this.atfIndex = (this.atfIndex + 1) % this.atfImages.length;
    }, 4000); // alle 4 Sekunden wechseln
  }
}