import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, effect, inject, Injector, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FeaturedCardsBlock } from '@jmgduarte/headless-core';
import { SafeStyleService } from '../../core/rendering/safe-style.service';

@Component({
  selector: 'headless-featured-cards',
  imports: [NgClass, NgStyle, MatCardModule, MatIconModule],
  templateUrl: './featured-cards.component.html',
  styleUrl: './featured-cards.component.scss',
})
export class FeaturedCardsComponent {
  readonly block = input.required<FeaturedCardsBlock>();
  private readonly styleService = inject(SafeStyleService);
  private readonly injector = inject(Injector);

  readonly data = computed(() => this.block().data);
  readonly selectedCategory = signal<string | null>(null);
  readonly categories = computed(() => [...new Set(this.data().cards.flatMap(card => card.categories ?? []))].sort());
  readonly activeCategory = computed(() => this.data().filtersEnabled && this.categories().includes(this.selectedCategory() ?? '')
    ? this.selectedCategory() : null);
  readonly visibleCards = computed(() => this.activeCategory() === null ? this.data().cards
    : this.data().cards.filter(card => card.categories?.includes(this.activeCategory()!)));
  readonly responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`);
  readonly styles = computed(() => this.styleService.toInlineStyles(this.block().style));
  readonly responsiveStyles = computed(() => this.styleService.responsiveCss(
    this.block().style,
    `.${this.responsiveClass()}.${this.responsiveClass()}`,
  ));

  constructor() {
    effect(() => this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles()), { injector: this.injector });
  }

  cardStyles(card: FeaturedCardsBlock['data']['cards'][number]): Record<string, string | number> {
    return card.style ? this.styleService.toInlineStyles(card.style) : {};
  }
}

