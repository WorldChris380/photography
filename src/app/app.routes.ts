import { Routes } from '@angular/router';
import { PhotoGallery } from './photo-gallery/photo-gallery';
import { PhotographyHome } from './photography-home/photography-home';
import { Contact } from './contact/contact';
import { AccountComponent } from './account/account';

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
    path: 'account',
    component: AccountComponent,
    data: { animation: 'account' }
  }
];
