import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { BlockStyle, M1StyleValue } from '@jmgduarte/headless-core';

@Injectable({ providedIn: 'root' })
export class SafeStyleService {
  private readonly document = inject(DOCUMENT);
  private readonly responsiveStyles = new Map<string, HTMLStyleElement>();

  registerResponsiveStyles(key: string, css: string): void {
    const existing = this.responsiveStyles.get(key);

    if (css === '') {
      existing?.remove();
      this.responsiveStyles.delete(key);
      return;
    }

    if (existing) {
      existing.textContent = css;
      return;
    }

    const style = this.document.createElement('style');
    style.setAttribute('data-headless-responsive', key);
    style.textContent = css;
    this.document.head.appendChild(style);
    this.responsiveStyles.set(key, style);
  }

  registerCustomStyles(key: string, css: string | undefined, scope: string): void {
    const scopedCss = css === undefined ? '' : this.scopeCustomCss(css, scope);
    this.registerResponsiveStyles(`custom-${key}`, scopedCss);
  }
  toInlineStyles(style: BlockStyle | undefined, allowedProperties?: readonly string[]): Record<string, string | number> {
    if (!style?.properties) {
      return {};
    }

    const result: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(style.properties)) {
      if (allowedProperties !== undefined && !allowedProperties.includes(key)) {
        continue;
      }

      const selected = this.scalarValue(value);

      if (selected !== undefined) {
        result[this.toCssProperty(key)] = selected;
      }
    }

    return result;
  }

  value(style: BlockStyle | undefined, property: string): string | number | undefined {
    const value = style?.properties?.[property as keyof typeof style.properties];

    return value !== undefined ? this.scalarValue(value) : undefined;
  }

  responsiveCss(
    style: BlockStyle | undefined,
    selector: string,
    allowedProperties?: readonly string[],
  ): string {
    if (!style?.properties) {
      return '';
    }

    const rules: Record<'mobile' | 'tablet' | 'desktop', string[]> = {
      mobile: [],
      tablet: [],
      desktop: [],
    };

    for (const [key, value] of Object.entries(style.properties)) {
      if (allowedProperties !== undefined && !allowedProperties.includes(key)) {
        continue;
      }

      if (!this.isBreakpointMap(value)) {
        continue;
      }

      const responsive = value as Record<string, unknown>;
      for (const breakpoint of ['mobile', 'tablet', 'desktop'] as const) {
        const breakpointValue = responsive[breakpoint];
        this.appendResponsiveDeclaration(rules[breakpoint], key, breakpointValue);
      }
    }

    return this.cssRules(selector, rules);
  }

  responsiveCssProperty(
    style: BlockStyle | undefined,
    property: string,
    selector: string,
    cssProperty = property,
  ): string {
    const value = style?.properties?.[property as keyof NonNullable<BlockStyle['properties']>];

    if (!this.isBreakpointMap(value)) {
      return '';
    }

    const rules: Record<'mobile' | 'tablet' | 'desktop', string[]> = {
      mobile: [],
      tablet: [],
      desktop: [],
    };

    const responsive = value as Record<string, unknown>;
    for (const breakpoint of ['mobile', 'tablet', 'desktop'] as const) {
      const breakpointValue = responsive[breakpoint];
      this.appendResponsiveDeclaration(rules[breakpoint], cssProperty, breakpointValue);
    }

    return this.cssRules(selector, rules);
  }

  spacing(
    style: BlockStyle | undefined,
    property: string,
    prefix = '',
  ): Record<string, string | number> {
    const value = style?.properties?.[property as keyof typeof style.properties];

    if (value === undefined || typeof value !== 'object') {
      return {};
    }

    const result: Record<string, string | number> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (key === 'mobile' || key === 'tablet' || key === 'desktop') {
        continue;
      }

      if (typeof entry === 'string' || typeof entry === 'number') {
        result[`${prefix}${this.toCssProperty(key)}`] = entry;
      }
    }

    return result;
  }

  private scalarValue(value: M1StyleValue): string | number | undefined {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    return undefined;
  }

  private isBreakpointMap(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object'
      && value !== null
      && Object.keys(value).some((key) => key === 'mobile' || key === 'tablet' || key === 'desktop');
  }

  private cssRules(selector: string, rules: Record<'mobile' | 'tablet' | 'desktop', string[]>): string {
    const safeSelector = selector.replace(/[^a-zA-Z0-9_.#\- :>+~()[\]=]/g, '');
    const output: string[] = [];

    if (rules.mobile.length > 0) {
      output.push(`${safeSelector}{${rules.mobile.join('')}}`);
    }
    if (rules.tablet.length > 0) {
      output.push(`@media (min-width: 782px){${safeSelector}{${rules.tablet.join('')}}}`);
    }
    if (rules.desktop.length > 0) {
      output.push(`@media (min-width: 1024px){${safeSelector}{${rules.desktop.join('')}}}`);
    }

    return output.join('');
  }

  private appendResponsiveDeclaration(
    declarations: string[],
    property: string,
    value: unknown,
  ): void {
    if (typeof value === 'string' || typeof value === 'number') {
      declarations.push(`${this.toCssProperty(property)}: ${value} !important;`);
      return;
    }

    if (typeof value !== 'object' || value === null) {
      return;
    }

    for (const [side, sideValue] of Object.entries(value)) {
      if ((typeof sideValue === 'string' || typeof sideValue === 'number')
        && ['top', 'right', 'bottom', 'left'].includes(side)) {
        declarations.push(`${this.toCssProperty(property)}-${side}: ${sideValue} !important;`);
      }
    }
  }

  private toCssProperty(value: string): string {
    return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
  }

  private scopeCustomCss(css: string, scope: string): string {
    if (/(?:@import|url\s*\(|expression\s*\(|javascript\s*:|behavior\s*:|-moz-binding)/i.test(css)) {
      return '';
    }

    const safeScope = `.${scope}`;
    return css.replace(/([^{}]+)\{([^{}]*)\}/g, (_match, rawSelector: string, declarations: string) => {
      const selectors = rawSelector
        .split(',')
        .map((selector) => selector.trim())
        .filter((selector) => selector !== '' && !selector.includes('@'))
        .map((selector) => selector.startsWith('&')
          ? selector.replace(/^&/, safeScope)
          : selector.startsWith(':scope')
            ? selector.replace(/^:scope/, safeScope)
            : `${safeScope}${selector}`)
        .join(',');

      if (selectors === '' || /[<>]/.test(declarations)) {
        return '';
      }

      return `${selectors}{${declarations}}`;
    });
  }
}


