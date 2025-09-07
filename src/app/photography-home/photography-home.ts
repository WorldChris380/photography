import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeNumbers } from '../home-numbers/home-numbers';
import { CountriesVisited } from '../countries-visited/countries-visited';

@Component({
  selector: 'app-photography-home',
  templateUrl: './photography-home.html',
  styleUrls: ['./photography-home.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, HomeNumbers, CountriesVisited]
})
export class PhotographyHome {
  atfImages = [
    'assets/img/photography/Travel/North America/Costa Rica/2024.06.02 So Butterfly Garden, La Fortuna Hotel/_CRB1629.jpg',
    'assets/img/photography/Travel/Europe/Greece/Kos 2021/CRB_0588.jpg',
    'assets/img/photography/Travel/North America/Costa Rica/2024.06.03 Mo La Fortuna Hot Springs Tabacon/_CRB1705.jpg',
    'assets/img/photography/Aviation/Europe/Czech Republic/Prague Airport (PRG)/2024.08.03 Sa Tagesausflug Prag/_CRB0017.jpg'
  ];
  atfIndex = 0;

  aviationCount = 0;
  travelCount = 0;
  gallery: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
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
}