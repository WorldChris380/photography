import { Routes } from '@angular/router';
import { PhotoGallery } from './photo-gallery/photo-gallery';
import { PhotographyHome } from './photography-home/photography-home';
import { Contact } from './contact/contact';
import { BlogIntro } from './blogs/blog-intro/blog-intro';
import { Account } from './account/account';
import { Checkout } from './paypal/checkout/checkout';
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
    path: 'account',
    component: Account,
    data: { animation: 'account' }
  },
  {
    path: 'blog',
    component: BlogIntro,
    data: { animation: 'blog' }
  },
  {
    path: 'checkout',
    component: Checkout,
    data: { animation: 'checkout' }
  },
  {
    path: 'blogs/flight-simulation-career-addons',
    component: Blog,
    data: { animation: 'blog-article' }
  }
];
