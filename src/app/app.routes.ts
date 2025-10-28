import { Routes } from '@angular/router';
import { PhotoGallery } from './photo-gallery/photo-gallery';
import { PhotographyHome } from './photography-home/photography-home';
import { Contact } from './contact/contact';
import { BlogHome } from './blog-home/blog-home';
import { Blog } from './blogs/flight-simulation-career-addons/flight-simulation-career-addons';

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
    path: 'blog',
    component: BlogHome,
    data: { animation: 'blog' }
  },
  {
    path: 'blogs/flight-simulation-career-addons',
    component: Blog,
    data: { animation: 'blog-article' }
  }
];
