import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LinkModel, NavigationItem } from '@jmgduarte/headless-core';

@Component({
  selector: 'headless-navigation-renderer',
  imports: [NgTemplateOutlet, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navigation-renderer.component.html',
  styleUrl: './navigation-renderer.component.scss',
})
export class NavigationRendererComponent {
  private readonly document = inject(DOCUMENT);
  readonly items = input.required<NavigationItem[]>();
  readonly ariaLabel = input('Primary navigation');
  readonly interceptInternalLinks = input(false);
  readonly linkSelected = output<LinkModel>();
  readonly mobileMenuOpen = signal(false);
  readonly mobileExpandedItems = signal<ReadonlySet<string>>(new Set());

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleMobileItem(itemId: string): void {
    this.mobileExpandedItems.update((expanded) => {
      const next = new Set(expanded);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  }

  isMobileItemExpanded(itemId: string): boolean {
    return this.mobileExpandedItems().has(itemId);
  }

  href(link: LinkModel): string {
    switch (link.type) {
      case 'internal':
        return link.path;
      case 'external':
        return link.url;
      case 'anchor':
        return `#${link.anchor}`;
      case 'email':
        return `mailto:${link.address}`;
      case 'telephone':
        return `tel:${link.number}`;
    }
  }

  select(event: MouseEvent, link: LinkModel): void {
    if (link.type === 'anchor') {
      event.preventDefault();
      const target = this.document.getElementById(link.anchor);

      if (target) {
        this.document.defaultView?.history.replaceState(null, '', `#${link.anchor}`);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      this.linkSelected.emit(link);
      this.closeMobileMenu();
      return;
    }

    if (this.interceptInternalLinks() && link.type === 'internal') {
      event.preventDefault();
    }

    this.linkSelected.emit(link);
    this.closeMobileMenu();
  }
}


