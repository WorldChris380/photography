import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  setTitle(value: string) {
    if (!value) return;
    this.title.setTitle(value);
    this.setMetaProperty('og:title', value);
  }

  setDescription(value: string) {
    if (!value) return;
    this.meta.updateTag({ name: 'description', content: value });
    this.setMetaProperty('og:description', value);
  }

  setCanonical(url: string) {
    if (!url) return;
    let link = this.doc.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setMetaProperty(name: string, content: string) {
    if (!content) return;
    const selector = `property="${name}"`;
    const existing = this.doc.head.querySelector(`meta[${selector}]`) as HTMLMetaElement | null;
    if (existing) {
      existing.content = content;
    } else {
      const m = this.doc.createElement('meta');
      m.setAttribute('property', name);
      m.setAttribute('content', content);
      this.doc.head.appendChild(m);
    }
  }

  setJsonLd(obj: any) {
    if (!obj) return;
    const id = 'seo-jsonld';
    const existing = this.doc.getElementById(id);
    if (existing) existing.remove();
    const s = this.doc.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify(obj);
    this.doc.head.appendChild(s);
  }
}