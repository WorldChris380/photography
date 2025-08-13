import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countries-visited',
  templateUrl: './countries-visited.html',
  styleUrls: ['./countries-visited.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CountriesVisited {
  continents = [
    {
      name: 'Africa',
      countries: ['Egypt', 'Cape Verde']
    },
    {
      name: 'Australia/Oceania',
      countries: ['Australia', 'Fiji']
    },
    {
      name: 'Asia',
      countries: [
        'Indonesia', 'Israel', 'Qatar', 'Malaysia', 'Oman', 'Philippines',
        'Singapore', 'Thailand', 'United Arab Emirates'
      ]
    },
    {
      name: 'Europe',
      countries: [
        'Belgium', 'Bulgaria', 'Denmark', 'Germany', 'France', 'Greece',
        'Italy', 'Latvia', 'Netherlands', 'Norway', 'Austria', 'Poland',
        'Portugal', 'Russia', 'Switzerland', 'Slovakia', 'Slovenia', 'Spain',
        'Czech Republic', 'Turkey', 'Ukraine', 'Hungary', 'Vatican City', 'United Kingdom', 'Belarus'
      ]
    },
    {
      name: 'North America',
      countries: ['Costa Rica', 'United States', 'Dominican Republic']
    }
  ];
  accordionOpen: string | null = null;
}
