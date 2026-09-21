import { NgClass, NgComponentOutlet, NgStyle, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, PLATFORM_ID, ViewChild, computed, effect, inject, input, signal } from '@angular/core';
import type { Swiper as SwiperInstance } from 'swiper';
import type { BasicBlock, PageBlock } from '@jmgduarte/headless-core';
import { BlockComponentRegistry } from '../../core/registry/block-component-registry';
import { SafeStyleService } from '../../core/rendering/safe-style.service';

@Component({
  selector: 'headless-grid',
  imports: [NgClass, NgComponentOutlet, NgStyle],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements AfterViewInit, OnDestroy {
  readonly block = input.required<BasicBlock>();
  @ViewChild('viewport', { static: true }) private viewport?: ElementRef<HTMLElement>;
  @ViewChild('previous', { static: true }) private previous?: ElementRef<HTMLButtonElement>;
  @ViewChild('next', { static: true }) private next?: ElementRef<HTMLButtonElement>;
  @ViewChild('pagination', { static: true }) private pagination?: ElementRef<HTMLElement>;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly registry = inject(BlockComponentRegistry);
  private readonly styleService = inject(SafeStyleService);
  private readonly injector = inject(Injector);
  private observer?: ResizeObserver;
  private readonly onWindowResize = () => this.recalculate();
  private swiper?: SwiperInstance;
  private viewReady = false;
  readonly sliderActive = signal(false);
  readonly responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`);

  constructor() {
    effect(() => {
      this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles());
    }, { injector: this.injector });
    effect(() => {
      this.block();
      if (this.viewReady) {
        queueMicrotask(() => this.recalculate());
      }
    }, { injector: this.injector });
  }

  classes(): Record<string, boolean> {
    return {
      'basic-block': true,
      [this.responsiveClass()]: true,
      'basic-block--layout-grid': true,
      'grid-viewport': true,
      'grid-viewport--slider': this.sliderActive(),
    };
  }

  responsiveStyles(): string {
    const properties = [
      'gridTemplateColumns', 'gap', 'display', 'alignItems', 'justifyContent',
    ] as const;
    return this.styleService.responsiveCss(
      this.block().style,
      `.${this.responsiveClass()}.${this.responsiveClass()}`,
      properties,
    ) + this.styleService.responsiveCss(
      this.block().style,
      `.${this.responsiveClass()}.${this.responsiveClass()} .grid-wrapper`,
      properties,
    );
  }

  styles(): Record<string, string | number> {
    return this.styleService.toInlineStyles(this.block().style, [
      'alignItems', 'background', 'backgroundColor', 'color', 'height', 'minHeight', 'padding', 'margin',
      'justifyContent', 'border', 'borderRadius', 'position', 'width',
    ]);
  }

  wrapperStyles(): Record<string, string | number> {
    const gap = this.block().style?.properties?.['gap'];
    const styles: Record<string, string | number> = {};
    Object.assign(styles, this.styleService.toInlineStyles(this.block().style, ['gridTemplateColumns']));
    if (typeof gap === 'string' || typeof gap === 'number') styles['gap'] = gap;
    if (gap && typeof gap === 'object') {
      const value = gap as Record<string, string | number>;
      if (value['top'] !== undefined) styles['row-gap'] = value['top'];
      if (value['left'] !== undefined) styles['column-gap'] = value['left'];
    }
    return styles;
  }

  childComponent(child: PageBlock) { return this.registry.resolve(child); }
  sliderConfigValue(): number { return this.sliderConfig().minColumnWidth; }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.viewport) return;
    this.viewReady = true;

    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.recalculate());
      this.observer.observe(this.viewport.nativeElement);
    } else {
      window.addEventListener('resize', this.onWindowResize, { passive: true });
    }

    this.recalculate();
    requestAnimationFrame(() => this.recalculate());
    window.setTimeout(() => this.recalculate(), 0);
    queueMicrotask(() => this.recalculate());
  }

  ngOnDestroy(): void {
    this.destroySwiper();
    this.observer?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onWindowResize);
    }
  }

  private recalculate(): void {
    const viewport = this.viewport?.nativeElement;
    const children = this.block().children ?? [];
    const config = this.sliderConfig();
    const canUseSlider = config.enabled && children.length > 1 && !this.hasUnsupportedPlacement(children);
    const gap = viewport ? this.readGap(viewport) : 0;
    const requiredWidth = children.length * config.minColumnWidth + Math.max(0, children.length - 1) * gap;
    const shouldUseSlider = canUseSlider && !!viewport && viewport.clientWidth < requiredWidth;
    if (shouldUseSlider === this.sliderActive()) return;
    this.sliderActive.set(shouldUseSlider);
    if (shouldUseSlider) queueMicrotask(() => this.createSwiper());
    else this.destroySwiper();
  }

  private async createSwiper(): Promise<void> {
    if (this.swiper || !this.viewport || !this.sliderActive()) return;
    const [{ default: Swiper }, modules] = await Promise.all([import('swiper'), import('swiper/modules')]);
    if (this.swiper || !this.viewport || !this.sliderActive()) return;
    const { A11y, Autoplay, Keyboard, Navigation, Pagination } = modules;
    const config = this.sliderConfig();
    this.swiper = new Swiper(this.viewport.nativeElement, {
      modules: [Navigation, Pagination, Keyboard, A11y, Autoplay],
      slidesPerView: 'auto', spaceBetween: this.readGap(this.viewport.nativeElement),
      keyboard: { enabled: true },
      a11y: { enabled: true, prevSlideMessage: 'Previous item', nextSlideMessage: 'Next item' },
      navigation: config.navigation && this.previous && this.next ? { prevEl: this.previous.nativeElement, nextEl: this.next.nativeElement } : undefined,
      pagination: config.pagination && this.pagination ? { el: this.pagination.nativeElement, clickable: true } : undefined,
      loop: config.loop && (this.block().children?.length ?? 0) > 2,
      autoplay: config.autoplay && !this.reducedMotion() ? { delay: config.autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true } : undefined,
    });
  }

  private destroySwiper(): void { this.swiper?.destroy(true, true); this.swiper = undefined; }

  private sliderConfig() {
    const raw = this.block().data.responsiveSlider ?? {};
    const number = (value: unknown, fallback: number, min: number, max: number) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
    const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback;
    return { enabled: bool(raw['enabled'], false), minColumnWidth: number(raw['minColumnWidth'], 280, 120, 800), navigation: bool(raw['navigation'], true), pagination: bool(raw['pagination'], true), loop: bool(raw['loop'], false), autoplay: bool(raw['autoplay'], false), autoplayDelay: number(raw['autoplayDelay'], 5000, 1000, 60000) };
  }

  private hasUnsupportedPlacement(children: PageBlock[]): boolean {
    return children.some((child) => {
      const properties = child.style?.properties as Record<string, unknown> | undefined;
      return ['columnSpan', 'rowSpan', 'columnStart', 'rowStart'].some((key) => properties?.[key] !== undefined);
    });
  }

  private readGap(element: HTMLElement): number { const gap = parseFloat(getComputedStyle(element).columnGap); return Number.isFinite(gap) ? gap : 0; }
  private reducedMotion(): boolean { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false; }
}

