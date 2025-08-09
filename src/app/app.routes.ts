import { Routes } from '@angular/router';
import { PhotoGallery } from './photo-gallery/photo-gallery';
import { PhotographyHome } from './photography-home/photography-home';


export const routes: Routes = [
  { path: 'gallery', component: PhotoGallery },
  { path: 'photography-home', component: PhotographyHome },
  // weitere Routen ...
];
