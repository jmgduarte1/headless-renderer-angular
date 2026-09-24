import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeadlessResourceHintService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  preloadImage(key: string, src: string | undefined, srcSet?: string, sizes?: string): void {
    if (!src || (!isPlatformBrowser(this.platformId) && !isPlatformServer(this.platformId))) return;

    let link = [...this.document.head.querySelectorAll<HTMLLinkElement>('link[data-headless-preload]')]
      .find((candidate) => candidate.getAttribute('data-headless-preload') === key);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.setAttribute('data-headless-preload', key);
      link.setAttribute('fetchpriority', 'high');
      this.document.head.appendChild(link);
    }

    link.href = src;
    if (srcSet) link.setAttribute('imagesrcset', srcSet);
    else link.removeAttribute('imagesrcset');
    if (sizes) link.setAttribute('imagesizes', sizes);
    else link.removeAttribute('imagesizes');
  }
}
