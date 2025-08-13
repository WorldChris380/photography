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
    'assets/img/photography/Aviation/Africa/Cape Verde/Boa Vista (BVC)/2023.06.14 Mi Mit Fahrrad/_CRB9353.JPG',
    'assets/img/photography/Aviation/Australia/Outback Australia.jpg',
    'assets/img/photography/Aviation/Europe/Mir Castle Belarus.jpg'
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