import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, effect, inject, Injector, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HeroBlock, HeroAction } from '@jmgduarte/headless-core';
import { SafeStyleService } from '../../core/rendering/safe-style.service';
import { HeadlessResourceHintService } from '../../core/rendering/headless-resource-hint.service';

@Component({
  selector: 'headless-hero',
  imports: [NgClass, NgStyle, MatButtonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly block = input.required<HeroBlock>();
  private readonly styleService = inject(SafeStyleService);
  private readonly resourceHints = inject(HeadlessResourceHintService);
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles());
    }, { injector: this.injector });

    effect(() => {
      const image = this.data().media?.image;
      if (image) {
        this.resourceHints.preloadImage(this.block().id, image.src, image.srcSet, image.sizes);
      }
    }, { injector: this.injector });
  }

  readonly data = computed(() => this.block().data);
  readonly responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`);
  readonly hostStyles = computed(() => {
    const style = this.block().style;
    const styles: Record<string, string | number> = {
      ...this.styleService.toInlineStyles(style, ['minHeight', 'padding', 'backgroundColor', 'color', 'fontFamily', 'fontSize', 'letterSpacing', 'boxShadow']),
      ...this.styleService.spacing(style, 'margin', 'margin-'),
    };
    const width = this.styleService.value(style, 'mediaWidth');

    if (width !== undefined) {
      styles['--hero-media-width'] = width;
    }

    return styles;
  });
  readonly contentStyles = computed(() => this.styleService.spacing(this.block().style, 'contentPadding', 'padding-'));
  readonly mediaStyles = computed(() => {
    const style = this.block().style;
    const styles: Record<string, string | number> = {};
    const aspectRatio = this.styleService.value(style, 'mediaAspectRatio');

    if (aspectRatio !== undefined) {
      const ratio = String(aspectRatio).trim();
      styles['aspect-ratio'] = ratio.includes('/') ? ratio.replace('/', ' / ') : `${ratio} / 1`;
    }

    return styles;
  });
  readonly overlayStyles = computed(() => {
    const style = this.block().style;
    const styles: Record<string, string | number> = {};
    const color = this.styleService.value(style, 'overlayColor');
    const opacity = this.styleService.value(style, 'overlayOpacity');

    if (color !== undefined) {
      styles['background-color'] = color;
    }

    if (opacity !== undefined) {
      styles['opacity'] = opacity;
    }

    return styles;
  });
  readonly hostClasses = computed(() => {
    const data = this.data();

    return {
      [`hero--media-${data.media?.placement ?? 'none'}`]: true,
      [`hero--align-${data.layout?.contentAlignment ?? 'start'}`]: true,
      [`hero--valign-${data.layout?.verticalAlignment ?? 'center'}`]: true,
      [`hero--width-${data.layout?.contentWidth ?? 'wide'}`]: true,
      [`hero--variant-${this.block().style?.variant ?? 'default'}`]: true,
      [this.responsiveClass()]: true,
    };
  });
  readonly responsiveStyles = computed(() => {
    const style = this.block().style;
    const selector = `.${this.responsiveClass()}.${this.responsiveClass()}`;
    return [
      this.styleService.responsiveCss(style, selector, ['minHeight', 'padding', 'backgroundColor', 'color', 'fontFamily', 'fontSize', 'letterSpacing', 'boxShadow']),
      this.styleService.responsiveCssProperty(style, 'contentPadding', `${selector} .hero__content`, 'padding'),
      this.styleService.responsiveCssProperty(style, 'mediaWidth', selector, '--hero-media-width'),
      this.styleService.responsiveCssProperty(style, 'mediaAspectRatio', `${selector} .hero__media`, 'aspectRatio'),
      this.styleService.responsiveCssProperty(style, 'overlayColor', `${selector} .hero__media-overlay`, 'backgroundColor'),
      this.styleService.responsiveCssProperty(style, 'overlayOpacity', `${selector} .hero__media-overlay`, 'opacity'),
    ].join('');
  });

  imageAlt(): string {
    const image = this.data().media?.image;

    return image?.decorative ? '' : (image?.alt ?? '');
  }

  relFor(action: HeroAction): string | null {
    if (action.link.type !== 'external') {
      return null;
    }

    const rel = new Set(action.link.rel ?? []);

    if (action.link.target === '_blank') {
      rel.add('noopener');
      rel.add('noreferrer');
    }

    return rel.size > 0 ? [...rel].join(' ') : null;
  }
}
