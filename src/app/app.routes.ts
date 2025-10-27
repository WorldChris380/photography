import { Routes } from '@angular/router';
import { PhotoGallery } from './photo-gallery/photo-gallery';
import { PhotographyHome } from './photography-home/photography-home';
import { Contact } from './contact/contact';
import { AccountComponent } from './account/account';
import { FlightSimulationCareerAddons } from './blogs/flight-simulation-career-addons/flight-simulation-career-addons';

export const routes: Routes = [
  {
    path: '',
    component: PhotographyHome,
    data: { animation: 'home' }
  },
  {
    path: 'gallery',
    component: PhotoGallery,
    data: { animation: 'gallery' }
  },
  {
    path: 'contact',
    component: Contact,
    data: { animation: 'contact' }
  },
  {
    path: 'blogs/flight-simulation-career-addons',
    component: FlightSimulationCareerAddons,
    data: { animation: 'flight-simulation-career-addons' }
  },
  {
    path: 'account',
    component: AccountComponent,
    data: { animation: 'account' }
  }
];
