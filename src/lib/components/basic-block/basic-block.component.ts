import { NgClass, NgComponentOutlet, NgStyle } from '@angular/common';
import { Component, computed, effect, inject, Injector, input } from '@angular/core';
import { BasicBlock, PageBlock } from '@jmgduarte/headless-core';
import { SafeStyleService } from '../../core/rendering/safe-style.service';
import { HeadlessResourceHintService } from '../../core/rendering/headless-resource-hint.service';
import { BlockComponentRegistry } from '../../core/registry/block-component-registry';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'headless-basic-block',
  imports: [NgClass, NgComponentOutlet, NgStyle, GridComponent],
  templateUrl: './basic-block.component.html',
  styleUrl: './basic-block.component.scss',
})
export class BasicBlockComponent {
  readonly block = input.required<BasicBlock>();
  private readonly styleService = inject(SafeStyleService);
  private readonly resourceHints = inject(HeadlessResourceHintService);
  private readonly registry = inject(BlockComponentRegistry);
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles());
      this.styleService.registerCustomStyles(this.responsiveClass(), this.data().customCss, this.responsiveClass());
    }, { injector: this.injector });

    effect(() => {
      if (this.imageFetchPriority() === 'high') {
        const data = this.data();
        this.resourceHints.preloadImage(this.block().id, data.src, data.srcSet, data.sizes);
      }
    }, { injector: this.injector });
  }

  readonly data = computed(() => this.block().data);
  readonly isPriorityImage = computed(() => this.data().fetchPriority === true);
  readonly imageLoading = computed(() => this.isPriorityImage() ? 'eager' : 'lazy');
  readonly imageFetchPriority = computed(() => this.isPriorityImage() ? 'high' : 'auto');
  childComponent(child: PageBlock) {
    return this.registry.resolve(child);
  }
  readonly responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`);
  readonly classes = computed(() => {
    const data = this.data();
    const attributes = data.attributes ?? {};
    const align = typeof attributes['align'] === 'string' ? attributes['align'] : undefined;
    const className = typeof attributes['className'] === 'string' ? attributes['className'] : undefined;
    const fontSize = typeof attributes['fontSize'] === 'string' ? attributes['fontSize'] : undefined;
    const isStackedOnMobile = attributes['isStackedOnMobile'];
    const width = this.block().style?.properties?.width;
    const hasResponsiveWidth = typeof width === 'object'
      && width !== null
      && Object.keys(width).some((key) => ['mobile', 'tablet', 'desktop'].includes(key));

    return {
      'basic-block': true,
      [this.responsiveClass()]: true,
      [`basic-block--${this.block().type}`]: true,
      [`basic-block--layout-${data.layout ?? 'default'}`]: true,
      'is-not-stacked-on-mobile': isStackedOnMobile === false,
      'has-responsive-width': hasResponsiveWidth && data.layout === 'column',
      [`align${align}`]: align !== undefined && this.block().type === 'container',
      [`has-text-align-${align}`]: align !== undefined && this.block().type === 'text',
      [`has-${fontSize}-font-size`]: fontSize !== undefined,
      [String(className ?? '')]: className !== undefined,
    };
  });
  readonly responsiveStyles = computed(() => this.styleService.responsiveCss(
    this.block().style,
    `.${this.responsiveClass()}.${this.responsiveClass()}`,
    [
      'minHeight', 'background', 'backgroundColor', 'color', 'fontFamily', 'fontSize', 'fontWeight',
      'letterSpacing', 'textTransform', 'lineHeight', 'fontStyle', 'textDecoration', 'textAlign', 'height',
      'alignItems', 'alignSelf', 'flexDirection', 'flexWrap', 'justifyContent', 'borderColor', 'borderWidth', 'borderStyle', 'border', 'borderTop',
      'borderBottom', 'outline', 'outlineOffset', 'position', 'display', 'objectFit', 'gridTemplateColumns', 'gap',
      'boxShadow',
    ],
  ) + (this.data().layout === 'column'
    ? this.styleService.responsiveCssProperty(this.block().style, 'width', `.${this.responsiveClass()}.${this.responsiveClass()}`, 'flexBasis')
    : ''));
  readonly styles = computed(() => {
    const style = this.block().style;
    const styles: Record<string, string | number> = {
      ...this.styleService.toInlineStyles(style, [
        'minHeight',
        'background',
        'backgroundColor',
        'color',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'textTransform',
        'lineHeight',
        'fontStyle',
        'textDecoration',
        'textAlign',
        'width',
        'height',
        'alignItems',
        'alignSelf',
        'borderRadius',
        'borderColor',
        'borderWidth',
        'borderStyle',
        'border',
        'outline',
        'outlineOffset',
        'position',
        'display',
        'objectFit',
        'flexDirection',
        'flexWrap',
        'justifyContent',
        'borderTop',
        'borderBottom',
        'gridTemplateColumns',
        'boxShadow',
      ]),
      ...this.styleService.spacing(style, 'margin', 'margin-'),
      ...this.styleService.spacing(style, 'padding', 'padding-'),
    };
    const aspectRatio = this.styleService.value(style, 'aspectRatio');
    const width = this.styleService.value(style, 'width');
    const gap = style?.properties?.gap;
    const borderRadius = style?.properties?.borderRadius;

    if (typeof borderRadius === 'object' && borderRadius !== null) {
      const corners = borderRadius as Record<string, string | number>;
      if (corners['topLeft']) styles['border-top-left-radius'] = corners['topLeft'];
      if (corners['topRight']) styles['border-top-right-radius'] = corners['topRight'];
      if (corners['bottomRight']) styles['border-bottom-right-radius'] = corners['bottomRight'];
      if (corners['bottomLeft']) styles['border-bottom-left-radius'] = corners['bottomLeft'];
    }

    if ((styles['border-width'] || styles['border-color']) && !styles['border-style']) {
      styles['border-style'] = 'solid';
    }

    if (this.data().layout === 'column' && width !== undefined) {
      delete styles['width'];
      styles['flex-basis'] = width;
    }

    if (aspectRatio !== undefined) {
      const ratio = String(aspectRatio).trim();
      styles['aspect-ratio'] = ratio.includes('/') ? ratio.replace('/', ' / ') : `${ratio} / 1`;
    }

    if (typeof gap === 'string' || typeof gap === 'number') {
      styles['gap'] = gap;
    } else if (gap !== undefined && typeof gap === 'object') {
      const axisGap = gap as Partial<Record<'top' | 'left', string | number>>;

      if (typeof axisGap.top === 'string' || typeof axisGap.top === 'number') {
        styles['row-gap'] = axisGap.top;
      }

      if (typeof axisGap.left === 'string' || typeof axisGap.left === 'number') {
        styles['column-gap'] = axisGap.left;
      }
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

  coverBackgroundChild(): BasicBlock | undefined {
    const child = this.block().children?.[0];
    return this.data().layout === 'cover' && child?.type === 'image' ? child : undefined;
  }

  coverContentChildren(): BasicBlock[] {
    const children = this.block().children ?? [];
    return this.coverBackgroundChild() === undefined ? children : children.slice(1);
  }
}
