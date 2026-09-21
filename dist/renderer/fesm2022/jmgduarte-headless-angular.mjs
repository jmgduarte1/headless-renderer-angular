import { DOCUMENT, NgClass, NgStyle, NgComponentOutlet, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, Injectable, input, Injector, effect, computed, Component, signal, DestroyRef, InjectionToken, makeEnvironmentProviders, PLATFORM_ID, ViewChild, output } from '@angular/core';
import * as i1 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import * as i1$1 from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as i1$2 from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import * as i2$1 from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import * as i4 from '@angular/material/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as i1$3 from '@angular/forms';
import { Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as i3 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as i4$1 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i6 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import * as i7 from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as i8 from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';
import * as i9 from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import * as i3$1 from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';

class SafeStyleService {
    document = inject(DOCUMENT);
    responsiveStyles = new Map();
    registerResponsiveStyles(key, css) {
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
    registerCustomStyles(key, css, scope) {
        const scopedCss = css === undefined ? '' : this.scopeCustomCss(css, scope);
        this.registerResponsiveStyles(`custom-${key}`, scopedCss);
    }
    toInlineStyles(style, allowedProperties) {
        if (!style?.properties) {
            return {};
        }
        const result = {};
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
    value(style, property) {
        const value = style?.properties?.[property];
        return value !== undefined ? this.scalarValue(value) : undefined;
    }
    responsiveCss(style, selector, allowedProperties) {
        if (!style?.properties) {
            return '';
        }
        const rules = {
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
            const responsive = value;
            for (const breakpoint of ['mobile', 'tablet', 'desktop']) {
                const breakpointValue = responsive[breakpoint];
                this.appendResponsiveDeclaration(rules[breakpoint], key, breakpointValue);
            }
        }
        return this.cssRules(selector, rules);
    }
    responsiveCssProperty(style, property, selector, cssProperty = property) {
        const value = style?.properties?.[property];
        if (!this.isBreakpointMap(value)) {
            return '';
        }
        const rules = {
            mobile: [],
            tablet: [],
            desktop: [],
        };
        const responsive = value;
        for (const breakpoint of ['mobile', 'tablet', 'desktop']) {
            const breakpointValue = responsive[breakpoint];
            this.appendResponsiveDeclaration(rules[breakpoint], cssProperty, breakpointValue);
        }
        return this.cssRules(selector, rules);
    }
    spacing(style, property, prefix = '') {
        const value = style?.properties?.[property];
        if (value === undefined || typeof value !== 'object') {
            return {};
        }
        const result = {};
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
    scalarValue(value) {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return undefined;
    }
    isBreakpointMap(value) {
        return typeof value === 'object'
            && value !== null
            && Object.keys(value).some((key) => key === 'mobile' || key === 'tablet' || key === 'desktop');
    }
    cssRules(selector, rules) {
        const safeSelector = selector.replace(/[^a-zA-Z0-9_.#\- :>+~()[\]=]/g, '');
        const output = [];
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
    appendResponsiveDeclaration(declarations, property, value) {
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
    toCssProperty(value) {
        return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    }
    scopeCustomCss(css, scope) {
        if (/(?:@import|url\s*\(|expression\s*\(|javascript\s*:|behavior\s*:|-moz-binding)/i.test(css)) {
            return '';
        }
        const safeScope = `.${scope}`;
        return css.replace(/([^{}]+)\{([^{}]*)\}/g, (_match, rawSelector, declarations) => {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: SafeStyleService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: SafeStyleService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: SafeStyleService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class HeroComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    styleService = inject(SafeStyleService);
    injector = inject(Injector);
    constructor() {
        effect(() => {
            this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles());
        }, { injector: this.injector });
    }
    data = computed(() => this.block().data, ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`, ...(ngDevMode ? [{ debugName: "responsiveClass" }] : /* istanbul ignore next */ []));
    hostStyles = computed(() => {
        const style = this.block().style;
        const styles = {
            ...this.styleService.toInlineStyles(style, ['minHeight', 'padding', 'backgroundColor', 'color', 'fontFamily', 'fontSize', 'letterSpacing', 'boxShadow']),
            ...this.styleService.spacing(style, 'margin', 'margin-'),
        };
        const width = this.styleService.value(style, 'mediaWidth');
        if (width !== undefined) {
            styles['--hero-media-width'] = width;
        }
        return styles;
    }, ...(ngDevMode ? [{ debugName: "hostStyles" }] : /* istanbul ignore next */ []));
    contentStyles = computed(() => this.styleService.spacing(this.block().style, 'contentPadding', 'padding-'), ...(ngDevMode ? [{ debugName: "contentStyles" }] : /* istanbul ignore next */ []));
    mediaStyles = computed(() => {
        const style = this.block().style;
        const styles = {};
        const aspectRatio = this.styleService.value(style, 'mediaAspectRatio');
        if (aspectRatio !== undefined) {
            const ratio = String(aspectRatio).trim();
            styles['aspect-ratio'] = ratio.includes('/') ? ratio.replace('/', ' / ') : `${ratio} / 1`;
        }
        return styles;
    }, ...(ngDevMode ? [{ debugName: "mediaStyles" }] : /* istanbul ignore next */ []));
    overlayStyles = computed(() => {
        const style = this.block().style;
        const styles = {};
        const color = this.styleService.value(style, 'overlayColor');
        const opacity = this.styleService.value(style, 'overlayOpacity');
        if (color !== undefined) {
            styles['background-color'] = color;
        }
        if (opacity !== undefined) {
            styles['opacity'] = opacity;
        }
        return styles;
    }, ...(ngDevMode ? [{ debugName: "overlayStyles" }] : /* istanbul ignore next */ []));
    hostClasses = computed(() => {
        const data = this.data();
        return {
            [`hero--media-${data.media?.placement ?? 'none'}`]: true,
            [`hero--align-${data.layout?.contentAlignment ?? 'start'}`]: true,
            [`hero--valign-${data.layout?.verticalAlignment ?? 'center'}`]: true,
            [`hero--width-${data.layout?.contentWidth ?? 'wide'}`]: true,
            [`hero--variant-${this.block().style?.variant ?? 'default'}`]: true,
            [this.responsiveClass()]: true,
        };
    }, ...(ngDevMode ? [{ debugName: "hostClasses" }] : /* istanbul ignore next */ []));
    responsiveStyles = computed(() => {
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
    }, ...(ngDevMode ? [{ debugName: "responsiveStyles" }] : /* istanbul ignore next */ []));
    imageAlt() {
        const image = this.data().media?.image;
        return image?.decorative ? '' : (image?.alt ?? '');
    }
    relFor(action) {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: HeroComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: HeroComponent, isStandalone: true, selector: "headless-hero", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "<section class=\"hero\" [ngClass]=\"hostClasses()\" [ngStyle]=\"hostStyles()\">\n  @if (data().media?.placement === 'background'; as background) {\n    <img\n      class=\"hero__background\"\n      [src]=\"data().media?.image?.src\"\n      [attr.alt]=\"imageAlt()\"\n      [attr.width]=\"data().media?.image?.width ?? null\"\n      [attr.height]=\"data().media?.image?.height ?? null\"\n    />\n  }\n\n  @if (data().media && data().media?.placement === 'start') {\n    <figure class=\"hero__media\" [ngStyle]=\"mediaStyles()\">\n      <img\n        [src]=\"data().media?.image?.src\"\n        [attr.alt]=\"imageAlt()\"\n        [attr.width]=\"data().media?.image?.width ?? null\"\n        [attr.height]=\"data().media?.image?.height ?? null\"\n      />\n      <span class=\"hero__media-overlay\" [ngStyle]=\"overlayStyles()\" aria-hidden=\"true\"></span>\n    </figure>\n  }\n\n  <div class=\"hero__content\" [ngStyle]=\"contentStyles()\">\n    @if (data().eyebrow) {\n      <p class=\"hero__eyebrow\">{{ data().eyebrow }}</p>\n    }\n\n    <h1 class=\"hero__title\">{{ data().title }}</h1>\n\n    @if (data().subtitle) {\n      <p class=\"hero__subtitle\">{{ data().subtitle }}</p>\n    }\n\n    @if (data().actions?.length) {\n      <div class=\"hero__actions\" aria-label=\"Hero actions\">\n        @for (action of data().actions; track action.id) {\n          @if (action.link.type === 'internal') {\n            <a\n              matButton=\"filled\"\n              [routerLink]=\"action.link.path\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n              [class.hero__action-secondary]=\"action.variant === 'secondary'\"\n              [class.hero__action-tertiary]=\"action.variant === 'tertiary'\"\n            >\n              {{ action.label }}\n            </a>\n          } @else if (action.link.type === 'external') {\n            <a\n              matButton=\"filled\"\n              [href]=\"action.link.url\"\n              [attr.target]=\"action.link.target ?? null\"\n              [attr.rel]=\"relFor(action)\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n              [class.hero__action-secondary]=\"action.variant === 'secondary'\"\n              [class.hero__action-tertiary]=\"action.variant === 'tertiary'\"\n            >\n              {{ action.label }}\n            </a>\n          } @else if (action.link.type === 'anchor') {\n            <a\n              matButton=\"filled\"\n              [href]=\"'#' + action.link.anchor\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n              [class.hero__action-secondary]=\"action.variant === 'secondary'\"\n              [class.hero__action-tertiary]=\"action.variant === 'tertiary'\"\n            >\n              {{ action.label }}\n            </a>\n          } @else {\n            <a\n              matButton=\"filled\"\n              [href]=\"action.link.type === 'email' ? 'mailto:' + action.link.address : 'tel:' + action.link.number\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n            >\n              {{ action.label }}\n            </a>\n          }\n        }\n      </div>\n    }\n  </div>\n\n  @if (data().media && data().media?.placement === 'end') {\n    <figure class=\"hero__media\" [ngStyle]=\"mediaStyles()\">\n      <img\n        [src]=\"data().media?.image?.src\"\n        [attr.alt]=\"imageAlt()\"\n        [attr.width]=\"data().media?.image?.width ?? null\"\n        [attr.height]=\"data().media?.image?.height ?? null\"\n      />\n      <span class=\"hero__media-overlay\" [ngStyle]=\"overlayStyles()\" aria-hidden=\"true\"></span>\n    </figure>\n  }\n</section>\n\n\n", styles: [".hero{align-items:center;background:#f8fafc;color:#102033;display:grid;gap:clamp(24px,5vw,64px);grid-template-columns:minmax(0,1fr);min-height:60vh;overflow:hidden;padding:clamp(32px,8vw,96px) clamp(20px,6vw,72px);position:relative}@media(min-width:800px){.hero--media-start{grid-template-columns:minmax(260px,var(--hero-media-width, 45%)) minmax(0,1fr)}}@media(min-width:800px){.hero--media-end{grid-template-columns:minmax(0,1fr) minmax(260px,var(--hero-media-width, 45%))}.hero--media-end .hero__media{order:2}}.hero--media-background{color:#fff}.hero__background{height:100%;inset:0;object-fit:cover;position:absolute;width:100%;z-index:0}.hero--media-background:after{background:linear-gradient(90deg,#081324c7,#08132447);content:\"\";inset:0;position:absolute;z-index:1}.hero__content,.hero__media{position:relative;z-index:2}.hero__content{max-width:760px}.hero--align-center .hero__content{margin-inline:auto;text-align:center}.hero--align-end .hero__content{margin-left:auto;text-align:right}.hero--width-narrow .hero__content{max-width:520px}.hero--width-medium .hero__content{max-width:640px}.hero--width-full .hero__content{max-width:none}.hero__eyebrow{font-size:.78rem;font-weight:800;margin:0 0 12px;text-transform:uppercase}.hero__title{font-size:clamp(2.5rem,6vw,5.5rem);font-weight:800;line-height:.98;margin:0}.hero__subtitle{font-size:clamp(1.1rem,2vw,1.45rem);line-height:1.55;margin:20px 0 0;max-width:64ch;white-space:pre-line}.hero__actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}.hero--align-center .hero__actions{justify-content:center}.hero--align-end .hero__actions{justify-content:flex-end}.hero__action-secondary{--mat-sys-primary: #334155}.hero__action-tertiary{--mat-sys-primary: #0f766e}.hero__media{align-self:stretch;margin:0;overflow:hidden;position:relative}.hero__media img{aspect-ratio:1/1;display:block;height:100%;object-fit:cover;width:100%}.hero__media-overlay{inset:0;opacity:0;pointer-events:none;position:absolute}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i1.MatButton, selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ", inputs: ["matButton"], exportAs: ["matButton", "matAnchor"] }, { kind: "directive", type: RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: HeroComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-hero', imports: [NgClass, NgStyle, MatButtonModule, RouterLink], template: "<section class=\"hero\" [ngClass]=\"hostClasses()\" [ngStyle]=\"hostStyles()\">\n  @if (data().media?.placement === 'background'; as background) {\n    <img\n      class=\"hero__background\"\n      [src]=\"data().media?.image?.src\"\n      [attr.alt]=\"imageAlt()\"\n      [attr.width]=\"data().media?.image?.width ?? null\"\n      [attr.height]=\"data().media?.image?.height ?? null\"\n    />\n  }\n\n  @if (data().media && data().media?.placement === 'start') {\n    <figure class=\"hero__media\" [ngStyle]=\"mediaStyles()\">\n      <img\n        [src]=\"data().media?.image?.src\"\n        [attr.alt]=\"imageAlt()\"\n        [attr.width]=\"data().media?.image?.width ?? null\"\n        [attr.height]=\"data().media?.image?.height ?? null\"\n      />\n      <span class=\"hero__media-overlay\" [ngStyle]=\"overlayStyles()\" aria-hidden=\"true\"></span>\n    </figure>\n  }\n\n  <div class=\"hero__content\" [ngStyle]=\"contentStyles()\">\n    @if (data().eyebrow) {\n      <p class=\"hero__eyebrow\">{{ data().eyebrow }}</p>\n    }\n\n    <h1 class=\"hero__title\">{{ data().title }}</h1>\n\n    @if (data().subtitle) {\n      <p class=\"hero__subtitle\">{{ data().subtitle }}</p>\n    }\n\n    @if (data().actions?.length) {\n      <div class=\"hero__actions\" aria-label=\"Hero actions\">\n        @for (action of data().actions; track action.id) {\n          @if (action.link.type === 'internal') {\n            <a\n              matButton=\"filled\"\n              [routerLink]=\"action.link.path\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n              [class.hero__action-secondary]=\"action.variant === 'secondary'\"\n              [class.hero__action-tertiary]=\"action.variant === 'tertiary'\"\n            >\n              {{ action.label }}\n            </a>\n          } @else if (action.link.type === 'external') {\n            <a\n              matButton=\"filled\"\n              [href]=\"action.link.url\"\n              [attr.target]=\"action.link.target ?? null\"\n              [attr.rel]=\"relFor(action)\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n              [class.hero__action-secondary]=\"action.variant === 'secondary'\"\n              [class.hero__action-tertiary]=\"action.variant === 'tertiary'\"\n            >\n              {{ action.label }}\n            </a>\n          } @else if (action.link.type === 'anchor') {\n            <a\n              matButton=\"filled\"\n              [href]=\"'#' + action.link.anchor\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n              [class.hero__action-secondary]=\"action.variant === 'secondary'\"\n              [class.hero__action-tertiary]=\"action.variant === 'tertiary'\"\n            >\n              {{ action.label }}\n            </a>\n          } @else {\n            <a\n              matButton=\"filled\"\n              [href]=\"action.link.type === 'email' ? 'mailto:' + action.link.address : 'tel:' + action.link.number\"\n              [attr.aria-label]=\"action.accessibleLabel ?? null\"\n            >\n              {{ action.label }}\n            </a>\n          }\n        }\n      </div>\n    }\n  </div>\n\n  @if (data().media && data().media?.placement === 'end') {\n    <figure class=\"hero__media\" [ngStyle]=\"mediaStyles()\">\n      <img\n        [src]=\"data().media?.image?.src\"\n        [attr.alt]=\"imageAlt()\"\n        [attr.width]=\"data().media?.image?.width ?? null\"\n        [attr.height]=\"data().media?.image?.height ?? null\"\n      />\n      <span class=\"hero__media-overlay\" [ngStyle]=\"overlayStyles()\" aria-hidden=\"true\"></span>\n    </figure>\n  }\n</section>\n\n\n", styles: [".hero{align-items:center;background:#f8fafc;color:#102033;display:grid;gap:clamp(24px,5vw,64px);grid-template-columns:minmax(0,1fr);min-height:60vh;overflow:hidden;padding:clamp(32px,8vw,96px) clamp(20px,6vw,72px);position:relative}@media(min-width:800px){.hero--media-start{grid-template-columns:minmax(260px,var(--hero-media-width, 45%)) minmax(0,1fr)}}@media(min-width:800px){.hero--media-end{grid-template-columns:minmax(0,1fr) minmax(260px,var(--hero-media-width, 45%))}.hero--media-end .hero__media{order:2}}.hero--media-background{color:#fff}.hero__background{height:100%;inset:0;object-fit:cover;position:absolute;width:100%;z-index:0}.hero--media-background:after{background:linear-gradient(90deg,#081324c7,#08132447);content:\"\";inset:0;position:absolute;z-index:1}.hero__content,.hero__media{position:relative;z-index:2}.hero__content{max-width:760px}.hero--align-center .hero__content{margin-inline:auto;text-align:center}.hero--align-end .hero__content{margin-left:auto;text-align:right}.hero--width-narrow .hero__content{max-width:520px}.hero--width-medium .hero__content{max-width:640px}.hero--width-full .hero__content{max-width:none}.hero__eyebrow{font-size:.78rem;font-weight:800;margin:0 0 12px;text-transform:uppercase}.hero__title{font-size:clamp(2.5rem,6vw,5.5rem);font-weight:800;line-height:.98;margin:0}.hero__subtitle{font-size:clamp(1.1rem,2vw,1.45rem);line-height:1.55;margin:20px 0 0;max-width:64ch;white-space:pre-line}.hero__actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}.hero--align-center .hero__actions{justify-content:center}.hero--align-end .hero__actions{justify-content:flex-end}.hero__action-secondary{--mat-sys-primary: #334155}.hero__action-tertiary{--mat-sys-primary: #0f766e}.hero__media{align-self:stretch;margin:0;overflow:hidden;position:relative}.hero__media img{aspect-ratio:1/1;display:block;height:100%;object-fit:cover;width:100%}.hero__media-overlay{inset:0;opacity:0;pointer-events:none;position:absolute}\n"] }]
        }], ctorParameters: () => [], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

class FeaturedCardsComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    styleService = inject(SafeStyleService);
    injector = inject(Injector);
    data = computed(() => this.block().data, ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    selectedCategory = signal(null, ...(ngDevMode ? [{ debugName: "selectedCategory" }] : /* istanbul ignore next */ []));
    categories = computed(() => [...new Set(this.data().cards.flatMap(card => card.categories ?? []))].sort(), ...(ngDevMode ? [{ debugName: "categories" }] : /* istanbul ignore next */ []));
    activeCategory = computed(() => this.data().filtersEnabled && this.categories().includes(this.selectedCategory() ?? '')
        ? this.selectedCategory() : null, ...(ngDevMode ? [{ debugName: "activeCategory" }] : /* istanbul ignore next */ []));
    visibleCards = computed(() => this.activeCategory() === null ? this.data().cards
        : this.data().cards.filter(card => card.categories?.includes(this.activeCategory())), ...(ngDevMode ? [{ debugName: "visibleCards" }] : /* istanbul ignore next */ []));
    responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`, ...(ngDevMode ? [{ debugName: "responsiveClass" }] : /* istanbul ignore next */ []));
    styles = computed(() => this.styleService.toInlineStyles(this.block().style), ...(ngDevMode ? [{ debugName: "styles" }] : /* istanbul ignore next */ []));
    responsiveStyles = computed(() => this.styleService.responsiveCss(this.block().style, `.${this.responsiveClass()}.${this.responsiveClass()}`), ...(ngDevMode ? [{ debugName: "responsiveStyles" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles()), { injector: this.injector });
    }
    cardStyles(card) {
        return card.style ? this.styleService.toInlineStyles(card.style) : {};
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FeaturedCardsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: FeaturedCardsComponent, isStandalone: true, selector: "headless-featured-cards", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "@if (data().filtersEnabled && categories().length > 0) {\n  <div class=\"featured-cards__filters\" role=\"group\" aria-label=\"Filter cards by category\">\n    <button type=\"button\" [attr.aria-pressed]=\"activeCategory() === null\" (click)=\"selectedCategory.set(null)\">All</button>\n    @for (category of categories(); track category) {\n      <button type=\"button\" [attr.aria-pressed]=\"activeCategory() === category\" (click)=\"selectedCategory.set(category)\">{{ category }}</button>\n    }\n  </div>\n  <span class=\"featured-cards__status\" role=\"status\">{{ visibleCards().length }} results</span>\n}\n<section class=\"featured-cards\" [ngClass]=\"responsiveClass()\" [ngStyle]=\"styles()\">\n  @for (card of visibleCards(); track card.id) {\n    <mat-card class=\"featured-card\" [ngStyle]=\"cardStyles(card)\">\n      <div class=\"featured-card__media\">\n        @if (card.image) {\n          <img [src]=\"card.image.src\" [alt]=\"card.image.alt ?? ''\" />\n        } @else if (card.icon) {\n          <mat-icon aria-hidden=\"true\">{{ card.icon }}</mat-icon>\n        }\n      </div>\n      <div class=\"featured-card__content\">\n        @if (card.eyebrow) { <div class=\"featured-card__eyebrow\">{{ card.eyebrow }}</div> }\n        <mat-card-title>{{ card.title }}</mat-card-title>\n        @if (card.tags.length > 0) {\n          <div class=\"featured-card__tags\" aria-label=\"Tags\">\n            @for (tag of card.tags; track tag) {\n              <span class=\"featured-card__tag\">{{ tag }}</span>\n            }\n          </div>\n        }\n        <mat-card-content>{{ card.text }}</mat-card-content>\n      </div>\n    </mat-card>\n  }\n</section>\n\n\n", styles: [":host{display:block}.featured-cards__filters{display:flex;flex-wrap:wrap;gap:.625rem;margin-bottom:1.625rem}.featured-cards__filters button{cursor:pointer;font:inherit;min-height:44px}.featured-cards__filters button:focus-visible{outline:3px solid currentColor;outline-offset:3px}.featured-cards__status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.featured-cards{box-sizing:border-box;display:grid;gap:var(--wp--preset--featured-cards--grid-gap, var(--wp--preset--spacing--40, 30px));grid-template-columns:repeat(4,minmax(0,1fr))}.featured-card{background:var(--wp--preset--featured-cards--card-background, var(--wp--preset--color--base, #fff));border:var(--wp--preset--featured-cards--card-border-width, 2px) var(--wp--preset--featured-cards--card-border-style, solid) var(--wp--preset--featured-cards--card-border-color, var(--wp--preset--color--accent-6, #e1edef));border-radius:var(--wp--preset--featured-cards--card-border-radius, 1.5rem);box-shadow:var(--wp--preset--featured-cards--card-shadow, 0 .5rem 1.25rem rgba(11, 48, 54, .08));box-sizing:border-box;color:var(--wp--preset--featured-cards--card-color, var(--wp--preset--color--accent-1, var(--wp--preset--color--contrast, #0b3036)));display:flex;flex-direction:column;align-items:flex-start;font-family:var(--wp--preset--featured-cards--font-family, var(--wp--preset--font-family--roboto, Roboto, sans-serif));min-width:0}.featured-card__content{display:flex;flex-direction:column;padding:var(--wp--preset--featured-cards--card-padding, var(--wp--preset--spacing--60, 70px))}.featured-card__media{align-items:center;background:var(--wp--preset--featured-cards--media-background, #ffffff);border-radius:var(--wp--preset--featured-cards--media-border-radius, 1.5rem 1.5rem 0 0);display:flex;height:var(--wp--preset--featured-cards--media-size, 9.25rem);justify-content:center;margin-bottom:var(--wp--preset--featured-cards--media-margin-bottom, var(--wp--preset--spacing--40, 30px));overflow:hidden;width:var(--wp--preset--featured-cards--media-size, 100%)}.featured-card__media img{height:100%;object-fit:cover;width:100%}.featured-card__media mat-icon{color:var(--wp--preset--featured-cards--icon-color, var(--wp--preset--color--accent-1, #0b5962));font-size:var(--wp--preset--featured-cards--icon-size, 3rem);height:var(--wp--preset--featured-cards--icon-size, 3rem);width:var(--wp--preset--featured-cards--icon-size, 3rem)}.featured-card mat-card-title{font-size:var(--wp--preset--featured-cards--title-font-size, var(--wp--preset--font-size--xx-large, 3rem));font-weight:var(--wp--preset--featured-cards--title-font-weight, 700);line-height:var(--wp--preset--featured-cards--title-line-height, 1.15);text-align:var(--wp--preset--featured-cards--title-text-align, center);margin:0 0 var(--wp--preset--featured-cards--title-margin-bottom, var(--wp--preset--spacing--40, 30px))}.featured-card__tags{display:flex;flex-wrap:wrap;gap:var(--wp--preset--featured-cards--tag-gap, var(--wp--preset--spacing--30, 20px));margin-bottom:var(--wp--preset--featured-cards--tags-margin-bottom, var(--wp--preset--spacing--40, 30px))}.featured-card__tag{background:var(--wp--preset--featured-cards--tag-background, #eaf5f5);border-radius:var(--wp--preset--featured-cards--tag-border-radius, 1.25rem);color:var(--wp--preset--featured-cards--tag-color, var(--wp--preset--color--accent-1, #0b5962));font-size:var(--wp--preset--featured-cards--tag-font-size, var(--wp--preset--font-size--large, 1.375rem));font-weight:var(--wp--preset--featured-cards--tag-font-weight, 700);line-height:1.2;padding:var(--wp--preset--featured-cards--tag-padding, .8rem 2rem)}.featured-card mat-card-content{color:var(--wp--preset--featured-cards--content-color, var(--wp--preset--color--contrast, #4a5966));font-size:var(--wp--preset--featured-cards--content-font-size, var(--wp--preset--font-size--x-large, 2rem));line-height:var(--wp--preset--featured-cards--content-line-height, 1.75);padding:0}@media(max-width:600px){.featured-card{border-radius:var(--wp--preset--featured-cards--card-border-radius-mobile, 1rem)}.featured-card__media{border-radius:var(--wp--preset--featured-cards--media-border-radius-mobile, 1rem 1rem 0 0);height:var(--wp--preset--featured-cards--media-size-mobile, 7rem);margin-bottom:var(--wp--preset--featured-cards--media-margin-bottom-mobile, var(--wp--preset--spacing--30, 20px))}.featured-card__media mat-icon{font-size:var(--wp--preset--featured-cards--icon-size-mobile, 4rem);height:var(--wp--preset--featured-cards--icon-size-mobile, 4rem);width:var(--wp--preset--featured-cards--icon-size-mobile, 4rem)}.featured-card mat-card-title{margin-bottom:var(--wp--preset--featured-cards--title-margin-bottom-mobile, var(--wp--preset--spacing--30, 20px))}.featured-card__tags{gap:var(--wp--preset--featured-cards--tag-gap-mobile, var(--wp--preset--spacing--20, 10px));margin-bottom:var(--wp--preset--featured-cards--tags-margin-bottom-mobile, var(--wp--preset--spacing--30, 20px))}.featured-card__tag{padding:var(--wp--preset--featured-cards--tag-padding-mobile, .6rem 1rem)}}@media(max-width:900px){.featured-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.featured-cards{grid-template-columns:1fr}}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: MatCardModule }, { kind: "component", type: i1$1.MatCard, selector: "mat-card", inputs: ["appearance"], exportAs: ["matCard"] }, { kind: "directive", type: i1$1.MatCardContent, selector: "mat-card-content" }, { kind: "directive", type: i1$1.MatCardTitle, selector: "mat-card-title, [mat-card-title], [matCardTitle]" }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FeaturedCardsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-featured-cards', imports: [NgClass, NgStyle, MatCardModule, MatIconModule], template: "@if (data().filtersEnabled && categories().length > 0) {\n  <div class=\"featured-cards__filters\" role=\"group\" aria-label=\"Filter cards by category\">\n    <button type=\"button\" [attr.aria-pressed]=\"activeCategory() === null\" (click)=\"selectedCategory.set(null)\">All</button>\n    @for (category of categories(); track category) {\n      <button type=\"button\" [attr.aria-pressed]=\"activeCategory() === category\" (click)=\"selectedCategory.set(category)\">{{ category }}</button>\n    }\n  </div>\n  <span class=\"featured-cards__status\" role=\"status\">{{ visibleCards().length }} results</span>\n}\n<section class=\"featured-cards\" [ngClass]=\"responsiveClass()\" [ngStyle]=\"styles()\">\n  @for (card of visibleCards(); track card.id) {\n    <mat-card class=\"featured-card\" [ngStyle]=\"cardStyles(card)\">\n      <div class=\"featured-card__media\">\n        @if (card.image) {\n          <img [src]=\"card.image.src\" [alt]=\"card.image.alt ?? ''\" />\n        } @else if (card.icon) {\n          <mat-icon aria-hidden=\"true\">{{ card.icon }}</mat-icon>\n        }\n      </div>\n      <div class=\"featured-card__content\">\n        @if (card.eyebrow) { <div class=\"featured-card__eyebrow\">{{ card.eyebrow }}</div> }\n        <mat-card-title>{{ card.title }}</mat-card-title>\n        @if (card.tags.length > 0) {\n          <div class=\"featured-card__tags\" aria-label=\"Tags\">\n            @for (tag of card.tags; track tag) {\n              <span class=\"featured-card__tag\">{{ tag }}</span>\n            }\n          </div>\n        }\n        <mat-card-content>{{ card.text }}</mat-card-content>\n      </div>\n    </mat-card>\n  }\n</section>\n\n\n", styles: [":host{display:block}.featured-cards__filters{display:flex;flex-wrap:wrap;gap:.625rem;margin-bottom:1.625rem}.featured-cards__filters button{cursor:pointer;font:inherit;min-height:44px}.featured-cards__filters button:focus-visible{outline:3px solid currentColor;outline-offset:3px}.featured-cards__status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.featured-cards{box-sizing:border-box;display:grid;gap:var(--wp--preset--featured-cards--grid-gap, var(--wp--preset--spacing--40, 30px));grid-template-columns:repeat(4,minmax(0,1fr))}.featured-card{background:var(--wp--preset--featured-cards--card-background, var(--wp--preset--color--base, #fff));border:var(--wp--preset--featured-cards--card-border-width, 2px) var(--wp--preset--featured-cards--card-border-style, solid) var(--wp--preset--featured-cards--card-border-color, var(--wp--preset--color--accent-6, #e1edef));border-radius:var(--wp--preset--featured-cards--card-border-radius, 1.5rem);box-shadow:var(--wp--preset--featured-cards--card-shadow, 0 .5rem 1.25rem rgba(11, 48, 54, .08));box-sizing:border-box;color:var(--wp--preset--featured-cards--card-color, var(--wp--preset--color--accent-1, var(--wp--preset--color--contrast, #0b3036)));display:flex;flex-direction:column;align-items:flex-start;font-family:var(--wp--preset--featured-cards--font-family, var(--wp--preset--font-family--roboto, Roboto, sans-serif));min-width:0}.featured-card__content{display:flex;flex-direction:column;padding:var(--wp--preset--featured-cards--card-padding, var(--wp--preset--spacing--60, 70px))}.featured-card__media{align-items:center;background:var(--wp--preset--featured-cards--media-background, #ffffff);border-radius:var(--wp--preset--featured-cards--media-border-radius, 1.5rem 1.5rem 0 0);display:flex;height:var(--wp--preset--featured-cards--media-size, 9.25rem);justify-content:center;margin-bottom:var(--wp--preset--featured-cards--media-margin-bottom, var(--wp--preset--spacing--40, 30px));overflow:hidden;width:var(--wp--preset--featured-cards--media-size, 100%)}.featured-card__media img{height:100%;object-fit:cover;width:100%}.featured-card__media mat-icon{color:var(--wp--preset--featured-cards--icon-color, var(--wp--preset--color--accent-1, #0b5962));font-size:var(--wp--preset--featured-cards--icon-size, 3rem);height:var(--wp--preset--featured-cards--icon-size, 3rem);width:var(--wp--preset--featured-cards--icon-size, 3rem)}.featured-card mat-card-title{font-size:var(--wp--preset--featured-cards--title-font-size, var(--wp--preset--font-size--xx-large, 3rem));font-weight:var(--wp--preset--featured-cards--title-font-weight, 700);line-height:var(--wp--preset--featured-cards--title-line-height, 1.15);text-align:var(--wp--preset--featured-cards--title-text-align, center);margin:0 0 var(--wp--preset--featured-cards--title-margin-bottom, var(--wp--preset--spacing--40, 30px))}.featured-card__tags{display:flex;flex-wrap:wrap;gap:var(--wp--preset--featured-cards--tag-gap, var(--wp--preset--spacing--30, 20px));margin-bottom:var(--wp--preset--featured-cards--tags-margin-bottom, var(--wp--preset--spacing--40, 30px))}.featured-card__tag{background:var(--wp--preset--featured-cards--tag-background, #eaf5f5);border-radius:var(--wp--preset--featured-cards--tag-border-radius, 1.25rem);color:var(--wp--preset--featured-cards--tag-color, var(--wp--preset--color--accent-1, #0b5962));font-size:var(--wp--preset--featured-cards--tag-font-size, var(--wp--preset--font-size--large, 1.375rem));font-weight:var(--wp--preset--featured-cards--tag-font-weight, 700);line-height:1.2;padding:var(--wp--preset--featured-cards--tag-padding, .8rem 2rem)}.featured-card mat-card-content{color:var(--wp--preset--featured-cards--content-color, var(--wp--preset--color--contrast, #4a5966));font-size:var(--wp--preset--featured-cards--content-font-size, var(--wp--preset--font-size--x-large, 2rem));line-height:var(--wp--preset--featured-cards--content-line-height, 1.75);padding:0}@media(max-width:600px){.featured-card{border-radius:var(--wp--preset--featured-cards--card-border-radius-mobile, 1rem)}.featured-card__media{border-radius:var(--wp--preset--featured-cards--media-border-radius-mobile, 1rem 1rem 0 0);height:var(--wp--preset--featured-cards--media-size-mobile, 7rem);margin-bottom:var(--wp--preset--featured-cards--media-margin-bottom-mobile, var(--wp--preset--spacing--30, 20px))}.featured-card__media mat-icon{font-size:var(--wp--preset--featured-cards--icon-size-mobile, 4rem);height:var(--wp--preset--featured-cards--icon-size-mobile, 4rem);width:var(--wp--preset--featured-cards--icon-size-mobile, 4rem)}.featured-card mat-card-title{margin-bottom:var(--wp--preset--featured-cards--title-margin-bottom-mobile, var(--wp--preset--spacing--30, 20px))}.featured-card__tags{gap:var(--wp--preset--featured-cards--tag-gap-mobile, var(--wp--preset--spacing--20, 10px));margin-bottom:var(--wp--preset--featured-cards--tags-margin-bottom-mobile, var(--wp--preset--spacing--30, 20px))}.featured-card__tag{padding:var(--wp--preset--featured-cards--tag-padding-mobile, .6rem 1rem)}}@media(max-width:900px){.featured-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.featured-cards{grid-template-columns:1fr}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

class TimelineComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    styleService = inject(SafeStyleService);
    injector = inject(Injector);
    data = computed(() => this.block().data, ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    styles = computed(() => this.styleService.toInlineStyles(this.block().style), ...(ngDevMode ? [{ debugName: "styles" }] : /* istanbul ignore next */ []));
    linkClass = computed(() => `timeline__link--${this.data().linkPosition ?? 'end'}`, ...(ngDevMode ? [{ debugName: "linkClass" }] : /* istanbul ignore next */ []));
    compactPeriods = computed(() => this.data().periods.filter(period => period.compact), ...(ngDevMode ? [{ debugName: "compactPeriods" }] : /* istanbul ignore next */ []));
    compactExpanded = signal(false, ...(ngDevMode ? [{ debugName: "compactExpanded" }] : /* istanbul ignore next */ []));
    compactPeriodState = signal({}, ...(ngDevMode ? [{ debugName: "compactPeriodState" }] : /* istanbul ignore next */ []));
    initializeCompactState = effect(() => {
        const periods = this.compactPeriods();
        const current = this.compactPeriodState();
        const next = { ...current };
        let changed = false;
        for (const period of periods) {
            if (!(period.id in next)) {
                next[period.id] = period.expanded === true;
                changed = true;
            }
        }
        if (changed)
            this.compactPeriodState.set(next);
    }, { ...(ngDevMode ? { debugName: "initializeCompactState" } : /* istanbul ignore next */ {}), injector: this.injector });
    periodStyles(period) { return period.style ? this.styleService.toInlineStyles(period.style) : {}; }
    toggleCompactPeriods() {
        const expanded = !this.compactExpanded();
        this.compactExpanded.set(expanded);
        this.compactPeriodState.update(state => {
            const next = { ...state };
            for (const period of this.compactPeriods()) {
                next[period.id] = expanded;
            }
            return next;
        });
    }
    isPeriodExpanded(period) { return this.compactExpanded() || this.compactPeriodState()[period.id] === true; }
    onDetailsToggle(period, event) { this.compactPeriodState.update(state => ({ ...state, [period.id]: event.target.open })); }
    formatDate(value) { const [year, month] = value.split('-'); const date = new Date(Number(year), Number(month) - 1, 1); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date).toUpperCase(); }
    periodRange(period) { return `${this.formatDate(period.start)} - ${this.formatDate(period.end)}`; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: TimelineComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: TimelineComponent, isStandalone: true, selector: "headless-timeline", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "<section class=\"timeline\" [ngStyle]=\"styles()\" aria-labelledby=\"timeline-title\">\n  <div class=\"timeline__header\">\n    <div>\n      @if (data().eyebrow) {\n        <div class=\"timeline__eyebrow\">{{ data().eyebrow }}</div>\n      }\n      @if (data().title) {\n        <h2 id=\"timeline-title\" class=\"timeline__title\">{{ data().title }}</h2>\n      }\n    </div>\n    @if (data().linkLabel && data().linkUrl) {\n      <a mat-button class=\"timeline__link\" [ngClass]=\"linkClass()\" [href]=\"data().linkUrl\">{{ data().linkLabel }}</a>\n    }\n  </div>\n  <ol class=\"timeline__list\" aria-label=\"Experience periods\">\n    @for (period of data().periods; track period.id) {\n      <li class=\"timeline__item\" [ngStyle]=\"periodStyles(period)\">\n        <div class=\"timeline__marker\" aria-hidden=\"true\"></div>\n        @if (period.compact) {\n          <details class=\"timeline__details\" [open]=\"isPeriodExpanded(period)\" (toggle)=\"onDetailsToggle(period, $event)\">\n            <summary>\n              <div>\n                <div class=\"timeline__period\">{{ periodRange(period) }}@if (period.company) { <span class=\"timeline__company\">\u00B7 {{ period.company }}</span> }</div>\n                <h3 class=\"timeline__period-title\">{{ period.title }}</h3>\n                @if (period.tags.length > 0) { <div class=\"timeline__compact-tags\">@for (tag of period.tags; track tag) { <span>{{ tag }}</span>@if (!$last) { <span aria-hidden=\"true\">\u00B7</span> } }</div> }\n              </div>\n              <span class=\"timeline__details-action\">{{ isPeriodExpanded(period) ? 'Hide details' : 'View details' }}</span>\n            </summary>\n            <div class=\"timeline__details-body\">\n              <p class=\"timeline__text\">{{ period.text }}</p>\n              @if (period.metric) { <div class=\"timeline__metric\">{{ period.metric }}</div> }\n            </div>\n          </details>\n        } @else {\n          <div class=\"timeline__period-card\">\n            <div class=\"timeline__period\">{{ periodRange(period) }}@if (period.company) { <span class=\"timeline__company\">\u00B7 {{ period.company }}</span> }</div>\n            <h3 class=\"timeline__period-title\">{{ period.title }}</h3>\n            <p class=\"timeline__text\">{{ period.text }}</p>\n            @if (period.tags.length > 0) { <div class=\"timeline__tags\" aria-label=\"Tags\">@for (tag of period.tags; track tag) { <span class=\"timeline__tag\">{{ tag }}</span> }</div> }\n            @if (period.metric) { <div class=\"timeline__metric\">{{ period.metric }}</div> }\n          </div>\n        }\n      </li>\n    }\n  </ol>\n  @if (compactPeriods().length > 0) {\n    <div class=\"timeline__controls\"><button mat-stroked-button type=\"button\" (click)=\"toggleCompactPeriods()\">{{ compactExpanded() ? 'Collapse earlier experience' : 'Expand all earlier experience' }}</button></div>\n  }\n</section>\n\n\n", styles: [":host{display:block}.timeline{color:var(--wp--preset--timeline-color--contrast, var(--wp--preset--color--accent-1, #0b3036))}.timeline__header{align-items:baseline;display:flex;gap:var(--wp--preset--timeline-spacing--header-gap, 1.5rem);justify-content:space-between}.timeline__eyebrow{color:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));font-size:var(--wp--preset--timeline-font-size--small, .875rem);font-weight:var(--wp--preset--timeline-font-weight--eyebrow, 700);letter-spacing:var(--wp--preset--timeline-letter-spacing--eyebrow, .08em);text-transform:uppercase}.timeline__title{font-size:var(--wp--preset--timeline-font-size--xx-large, 3rem);margin:0 0 var(--wp--preset--timeline-spacing--title-margin-bottom, 1.5rem)}.timeline__link{flex:0 0 auto}.timeline__link--start{order:-1;margin-right:auto}.timeline__link--center{margin-left:auto;margin-right:auto}.timeline__list{list-style:none;margin:0;padding:0 0 0 2rem}.timeline__item{border-left:var(--wp--preset--timeline-border-width, 2px) solid var(--wp--preset--timeline-color--line, #d3e2df);padding:0 0 var(--wp--preset--timeline-spacing--item-bottom, 2.5rem) var(--wp--preset--timeline-spacing--item-start, 1.5rem);position:relative}.timeline__item:last-child{padding-bottom:0}.timeline__marker{background:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));border:var(--wp--preset--timeline-marker-border-width, 3px) solid var(--wp--preset--timeline-color--base, #fff);border-radius:50%;box-shadow:0 0 0 var(--wp--preset--timeline-marker-halo-width, 5px) var(--wp--preset--timeline-color--accent-soft, #dff3ef);height:var(--wp--preset--timeline-marker-size, .75rem);left:var(--wp--preset--timeline-marker-offset, -.45rem);position:absolute;top:var(--wp--preset--timeline-marker-top, .15rem);width:var(--wp--preset--timeline-marker-size, .75rem)}.timeline__period{color:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));font-size:var(--wp--preset--timeline-font-size--small, .8125rem);font-weight:var(--wp--preset--timeline-font-weight--period, 800);letter-spacing:var(--wp--preset--timeline-letter-spacing--period, .08em);line-height:var(--wp--preset--timeline-line-height--period, 1.35);margin-bottom:var(--wp--preset--timeline-spacing--period-margin-bottom, 1.25rem)}.timeline__company{font-weight:var(--wp--preset--timeline-font-weight--company, 800);margin-left:var(--wp--preset--timeline-spacing--company-margin-start, .25rem);text-transform:uppercase}.timeline__period-card{background:var(--wp--preset--timeline-color--surface, #fff);border:var(--wp--preset--timeline-border-width-card, 1px) solid var(--wp--preset--timeline-color--line, #d3e2df);border-radius:var(--wp--preset--timeline-border-radius, 18px);box-shadow:var(--wp--preset--timeline-box-shadow, 0 12px 32px rgba(10, 55, 58, .06));padding:var(--wp--preset--timeline-spacing--card-padding, 1.5rem)}.timeline__period-card .timeline__period{margin-bottom:var(--wp--preset--timeline-spacing--card-period-margin-bottom, .5rem)}.timeline__period-card .timeline__period-title{margin-bottom:var(--wp--preset--timeline-spacing--card-title-margin-bottom, .5rem)}.timeline__period-title{font-size:var(--wp--preset--timeline-font-size--medium, 1.125rem);margin:0 0 var(--wp--preset--timeline-spacing--title-margin-bottom, 1rem)}.timeline__text{color:var(--wp--preset--timeline-color--muted, var(--wp--preset--color--accent-3, #5f7477));margin:0}.timeline__tags{display:flex;flex-wrap:wrap;gap:var(--wp--preset--timeline-spacing--tag-gap, .5rem);margin:0 0 var(--wp--preset--timeline-spacing--tags-margin-bottom, 1rem)}.timeline__tag{background:var(--wp--preset--timeline-color--surface-soft, #eef8f6);border:var(--wp--preset--timeline-border-width-tag, 1px) solid var(--wp--preset--timeline-color--line, #d3e2df);font-size:var(--wp--preset--timeline-font-size--x-small, .735rem);border-radius:var(--wp--preset--timeline-border-radius-pill, 999px);padding:var(--wp--preset--timeline-spacing--tag-padding-y, .25rem) var(--wp--preset--timeline-spacing--tag-padding-x, .65rem)}.timeline__metric{border-top:var(--wp--preset--timeline-border-width-metric, 1px) solid var(--wp--preset--timeline-color--accent-6, #d3e2df);font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem);font-weight:800;margin-top:var(--wp--preset--timeline-spacing--metric-margin-top, 1rem);padding-top:var(--wp--preset--timeline-spacing--metric-padding-top, .875rem)}.timeline__details{background:var(--wp--preset--timeline-color--surface, #fff);border:var(--wp--preset--timeline-border-width-card, 1px) solid var(--wp--preset--timeline-color--line, #d3e2df);border-radius:var(--wp--preset--timeline-border-radius, 18px);box-shadow:var(--wp--preset--timeline-box-shadow, 0 12px 32px rgba(10, 55, 58, .06));overflow:hidden}.timeline__details summary{align-items:center;cursor:pointer;display:flex;gap:var(--wp--preset--timeline-spacing--details-gap, 1.25rem);justify-content:space-between;list-style:none;padding:var(--wp--preset--timeline-spacing--details-padding-y, 1.375rem) var(--wp--preset--timeline-spacing--details-padding-x, 1.5rem)}.timeline__details summary::-webkit-details-marker{display:none}.timeline__details[open] summary{border-bottom:var(--wp--preset--timeline-border-width-details, 1px) solid var(--wp--preset--timeline-color--accent-6, #d3e2df)}.timeline__details .timeline__period{margin-bottom:var(--wp--preset--timeline-spacing--details-period-margin-bottom, .125rem)}.timeline__details .timeline__period-title{margin-bottom:var(--wp--preset--timeline-spacing--details-title-margin-bottom, .125rem)}.timeline__compact-tags{color:var(--wp--preset--timeline-color--accent-4, #5f7477);font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem);font-weight:700}.timeline__details-action{color:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem);font-weight:var(--wp--preset--timeline-font-weight--action, 850);white-space:nowrap}.timeline__details[open] .timeline__details-action{font-size:0}.timeline__details[open] .timeline__details-action:after{content:\"Hide details\";font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem)}.timeline__details-body{padding:var(--wp--preset--timeline-spacing--details-body-top, 1.25rem) var(--wp--preset--timeline-spacing--details-body-x, 1.5rem) var(--wp--preset--timeline-spacing--details-body-bottom, 1.5rem)}.timeline__controls{display:flex;justify-content:flex-end;margin-top:var(--wp--preset--timeline-spacing--controls-margin-top, 1.125rem)}@media(max-width:600px){.timeline__header{align-items:flex-start;flex-direction:column;gap:var(--wp--preset--timeline-spacing--mobile-header-gap, .5rem)}.timeline__link--center,.timeline__link--end{margin-left:0;margin-right:0}.timeline__details summary{align-items:flex-start;flex-direction:column}.timeline__controls{justify-content:stretch}.timeline__controls button{width:100%}}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i1.MatButton, selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ", inputs: ["matButton"], exportAs: ["matButton", "matAnchor"] }, { kind: "ngmodule", type: MatListModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: TimelineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-timeline', imports: [NgClass, NgStyle, MatButtonModule, MatListModule], template: "<section class=\"timeline\" [ngStyle]=\"styles()\" aria-labelledby=\"timeline-title\">\n  <div class=\"timeline__header\">\n    <div>\n      @if (data().eyebrow) {\n        <div class=\"timeline__eyebrow\">{{ data().eyebrow }}</div>\n      }\n      @if (data().title) {\n        <h2 id=\"timeline-title\" class=\"timeline__title\">{{ data().title }}</h2>\n      }\n    </div>\n    @if (data().linkLabel && data().linkUrl) {\n      <a mat-button class=\"timeline__link\" [ngClass]=\"linkClass()\" [href]=\"data().linkUrl\">{{ data().linkLabel }}</a>\n    }\n  </div>\n  <ol class=\"timeline__list\" aria-label=\"Experience periods\">\n    @for (period of data().periods; track period.id) {\n      <li class=\"timeline__item\" [ngStyle]=\"periodStyles(period)\">\n        <div class=\"timeline__marker\" aria-hidden=\"true\"></div>\n        @if (period.compact) {\n          <details class=\"timeline__details\" [open]=\"isPeriodExpanded(period)\" (toggle)=\"onDetailsToggle(period, $event)\">\n            <summary>\n              <div>\n                <div class=\"timeline__period\">{{ periodRange(period) }}@if (period.company) { <span class=\"timeline__company\">\u00B7 {{ period.company }}</span> }</div>\n                <h3 class=\"timeline__period-title\">{{ period.title }}</h3>\n                @if (period.tags.length > 0) { <div class=\"timeline__compact-tags\">@for (tag of period.tags; track tag) { <span>{{ tag }}</span>@if (!$last) { <span aria-hidden=\"true\">\u00B7</span> } }</div> }\n              </div>\n              <span class=\"timeline__details-action\">{{ isPeriodExpanded(period) ? 'Hide details' : 'View details' }}</span>\n            </summary>\n            <div class=\"timeline__details-body\">\n              <p class=\"timeline__text\">{{ period.text }}</p>\n              @if (period.metric) { <div class=\"timeline__metric\">{{ period.metric }}</div> }\n            </div>\n          </details>\n        } @else {\n          <div class=\"timeline__period-card\">\n            <div class=\"timeline__period\">{{ periodRange(period) }}@if (period.company) { <span class=\"timeline__company\">\u00B7 {{ period.company }}</span> }</div>\n            <h3 class=\"timeline__period-title\">{{ period.title }}</h3>\n            <p class=\"timeline__text\">{{ period.text }}</p>\n            @if (period.tags.length > 0) { <div class=\"timeline__tags\" aria-label=\"Tags\">@for (tag of period.tags; track tag) { <span class=\"timeline__tag\">{{ tag }}</span> }</div> }\n            @if (period.metric) { <div class=\"timeline__metric\">{{ period.metric }}</div> }\n          </div>\n        }\n      </li>\n    }\n  </ol>\n  @if (compactPeriods().length > 0) {\n    <div class=\"timeline__controls\"><button mat-stroked-button type=\"button\" (click)=\"toggleCompactPeriods()\">{{ compactExpanded() ? 'Collapse earlier experience' : 'Expand all earlier experience' }}</button></div>\n  }\n</section>\n\n\n", styles: [":host{display:block}.timeline{color:var(--wp--preset--timeline-color--contrast, var(--wp--preset--color--accent-1, #0b3036))}.timeline__header{align-items:baseline;display:flex;gap:var(--wp--preset--timeline-spacing--header-gap, 1.5rem);justify-content:space-between}.timeline__eyebrow{color:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));font-size:var(--wp--preset--timeline-font-size--small, .875rem);font-weight:var(--wp--preset--timeline-font-weight--eyebrow, 700);letter-spacing:var(--wp--preset--timeline-letter-spacing--eyebrow, .08em);text-transform:uppercase}.timeline__title{font-size:var(--wp--preset--timeline-font-size--xx-large, 3rem);margin:0 0 var(--wp--preset--timeline-spacing--title-margin-bottom, 1.5rem)}.timeline__link{flex:0 0 auto}.timeline__link--start{order:-1;margin-right:auto}.timeline__link--center{margin-left:auto;margin-right:auto}.timeline__list{list-style:none;margin:0;padding:0 0 0 2rem}.timeline__item{border-left:var(--wp--preset--timeline-border-width, 2px) solid var(--wp--preset--timeline-color--line, #d3e2df);padding:0 0 var(--wp--preset--timeline-spacing--item-bottom, 2.5rem) var(--wp--preset--timeline-spacing--item-start, 1.5rem);position:relative}.timeline__item:last-child{padding-bottom:0}.timeline__marker{background:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));border:var(--wp--preset--timeline-marker-border-width, 3px) solid var(--wp--preset--timeline-color--base, #fff);border-radius:50%;box-shadow:0 0 0 var(--wp--preset--timeline-marker-halo-width, 5px) var(--wp--preset--timeline-color--accent-soft, #dff3ef);height:var(--wp--preset--timeline-marker-size, .75rem);left:var(--wp--preset--timeline-marker-offset, -.45rem);position:absolute;top:var(--wp--preset--timeline-marker-top, .15rem);width:var(--wp--preset--timeline-marker-size, .75rem)}.timeline__period{color:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));font-size:var(--wp--preset--timeline-font-size--small, .8125rem);font-weight:var(--wp--preset--timeline-font-weight--period, 800);letter-spacing:var(--wp--preset--timeline-letter-spacing--period, .08em);line-height:var(--wp--preset--timeline-line-height--period, 1.35);margin-bottom:var(--wp--preset--timeline-spacing--period-margin-bottom, 1.25rem)}.timeline__company{font-weight:var(--wp--preset--timeline-font-weight--company, 800);margin-left:var(--wp--preset--timeline-spacing--company-margin-start, .25rem);text-transform:uppercase}.timeline__period-card{background:var(--wp--preset--timeline-color--surface, #fff);border:var(--wp--preset--timeline-border-width-card, 1px) solid var(--wp--preset--timeline-color--line, #d3e2df);border-radius:var(--wp--preset--timeline-border-radius, 18px);box-shadow:var(--wp--preset--timeline-box-shadow, 0 12px 32px rgba(10, 55, 58, .06));padding:var(--wp--preset--timeline-spacing--card-padding, 1.5rem)}.timeline__period-card .timeline__period{margin-bottom:var(--wp--preset--timeline-spacing--card-period-margin-bottom, .5rem)}.timeline__period-card .timeline__period-title{margin-bottom:var(--wp--preset--timeline-spacing--card-title-margin-bottom, .5rem)}.timeline__period-title{font-size:var(--wp--preset--timeline-font-size--medium, 1.125rem);margin:0 0 var(--wp--preset--timeline-spacing--title-margin-bottom, 1rem)}.timeline__text{color:var(--wp--preset--timeline-color--muted, var(--wp--preset--color--accent-3, #5f7477));margin:0}.timeline__tags{display:flex;flex-wrap:wrap;gap:var(--wp--preset--timeline-spacing--tag-gap, .5rem);margin:0 0 var(--wp--preset--timeline-spacing--tags-margin-bottom, 1rem)}.timeline__tag{background:var(--wp--preset--timeline-color--surface-soft, #eef8f6);border:var(--wp--preset--timeline-border-width-tag, 1px) solid var(--wp--preset--timeline-color--line, #d3e2df);font-size:var(--wp--preset--timeline-font-size--x-small, .735rem);border-radius:var(--wp--preset--timeline-border-radius-pill, 999px);padding:var(--wp--preset--timeline-spacing--tag-padding-y, .25rem) var(--wp--preset--timeline-spacing--tag-padding-x, .65rem)}.timeline__metric{border-top:var(--wp--preset--timeline-border-width-metric, 1px) solid var(--wp--preset--timeline-color--accent-6, #d3e2df);font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem);font-weight:800;margin-top:var(--wp--preset--timeline-spacing--metric-margin-top, 1rem);padding-top:var(--wp--preset--timeline-spacing--metric-padding-top, .875rem)}.timeline__details{background:var(--wp--preset--timeline-color--surface, #fff);border:var(--wp--preset--timeline-border-width-card, 1px) solid var(--wp--preset--timeline-color--line, #d3e2df);border-radius:var(--wp--preset--timeline-border-radius, 18px);box-shadow:var(--wp--preset--timeline-box-shadow, 0 12px 32px rgba(10, 55, 58, .06));overflow:hidden}.timeline__details summary{align-items:center;cursor:pointer;display:flex;gap:var(--wp--preset--timeline-spacing--details-gap, 1.25rem);justify-content:space-between;list-style:none;padding:var(--wp--preset--timeline-spacing--details-padding-y, 1.375rem) var(--wp--preset--timeline-spacing--details-padding-x, 1.5rem)}.timeline__details summary::-webkit-details-marker{display:none}.timeline__details[open] summary{border-bottom:var(--wp--preset--timeline-border-width-details, 1px) solid var(--wp--preset--timeline-color--accent-6, #d3e2df)}.timeline__details .timeline__period{margin-bottom:var(--wp--preset--timeline-spacing--details-period-margin-bottom, .125rem)}.timeline__details .timeline__period-title{margin-bottom:var(--wp--preset--timeline-spacing--details-title-margin-bottom, .125rem)}.timeline__compact-tags{color:var(--wp--preset--timeline-color--accent-4, #5f7477);font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem);font-weight:700}.timeline__details-action{color:var(--wp--preset--timeline-color--accent, var(--wp--preset--color--accent-2, #0b7d79));font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem);font-weight:var(--wp--preset--timeline-font-weight--action, 850);white-space:nowrap}.timeline__details[open] .timeline__details-action{font-size:0}.timeline__details[open] .timeline__details-action:after{content:\"Hide details\";font-size:var(--wp--preset--timeline-font-size--x-small, .8125rem)}.timeline__details-body{padding:var(--wp--preset--timeline-spacing--details-body-top, 1.25rem) var(--wp--preset--timeline-spacing--details-body-x, 1.5rem) var(--wp--preset--timeline-spacing--details-body-bottom, 1.5rem)}.timeline__controls{display:flex;justify-content:flex-end;margin-top:var(--wp--preset--timeline-spacing--controls-margin-top, 1.125rem)}@media(max-width:600px){.timeline__header{align-items:flex-start;flex-direction:column;gap:var(--wp--preset--timeline-spacing--mobile-header-gap, .5rem)}.timeline__link--center,.timeline__link--end{margin-left:0;margin-right:0}.timeline__details summary{align-items:flex-start;flex-direction:column}.timeline__controls{justify-content:stretch}.timeline__controls button{width:100%}}\n"] }]
        }], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

class UnsupportedBlockComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: UnsupportedBlockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.23", type: UnsupportedBlockComponent, isStandalone: true, selector: "headless-unsupported-block", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "<section class=\"unsupported-block\" role=\"status\">\n  Unsupported block: {{ block().type }}\n</section>\n\n\n", styles: [".unsupported-block{border:1px solid #f59e0b;color:#713f12;padding:16px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: UnsupportedBlockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-unsupported-block', template: "<section class=\"unsupported-block\" role=\"status\">\n  Unsupported block: {{ block().type }}\n</section>\n\n\n", styles: [".unsupported-block{border:1px solid #f59e0b;color:#713f12;padding:16px}\n"] }]
        }], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

class InteractiveBlockComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    styleService = inject(SafeStyleService);
    registry = inject(BlockComponentRegistry);
    breakpointObserver = inject(BreakpointObserver);
    injector = inject(Injector);
    data = computed(() => this.block().data, ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`, ...(ngDevMode ? [{ debugName: "responsiveClass" }] : /* istanbul ignore next */ []));
    styles = computed(() => this.styleService.toInlineStyles(this.block().style), ...(ngDevMode ? [{ debugName: "styles" }] : /* istanbul ignore next */ []));
    activeTab = signal(0, ...(ngDevMode ? [{ debugName: "activeTab" }] : /* istanbul ignore next */ []));
    isMobile = signal(false, ...(ngDevMode ? [{ debugName: "isMobile" }] : /* istanbul ignore next */ []));
    classes = computed(() => {
        const align = this.data().attributes?.['align'];
        return {
            alignnone: align === 'none',
            alignwide: align === 'wide',
            alignfull: align === 'full',
        };
    }, ...(ngDevMode ? [{ debugName: "classes" }] : /* istanbul ignore next */ []));
    constructor() {
        this.breakpointObserver.observe('(max-width: 699.98px)')
            .pipe(map((state) => state.matches), takeUntilDestroyed(inject(DestroyRef)))
            .subscribe((matches) => this.isMobile.set(matches));
        effect(() => {
            const tabs = this.data().tabs ?? [];
            const index = this.data().activeIndex ?? 0;
            this.activeTab.set(tabs.length > 0 ? Math.max(0, Math.min(Math.trunc(index), tabs.length - 1)) : 0);
        }, { injector: this.injector });
    }
    selectTab(index) {
        this.activeTab.set(index);
    }
    openAccordion(index) {
        this.activeTab.set(index);
    }
    closeAccordion(index) {
        if (this.activeTab() === index) {
            this.activeTab.set(-1);
        }
    }
    onTabKeydown(event, index) {
        const tabs = this.data().tabs ?? [];
        const vertical = this.data().orientation === 'vertical';
        const previous = vertical ? 'ArrowUp' : 'ArrowLeft';
        const next = vertical ? 'ArrowDown' : 'ArrowRight';
        let target = index;
        if (event.key === next)
            target = (index + 1) % tabs.length;
        else if (event.key === previous)
            target = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home')
            target = 0;
        else if (event.key === 'End')
            target = tabs.length - 1;
        else
            return;
        event.preventDefault();
        this.selectTab(target);
        queueMicrotask(() => document.getElementById(this.tabId(target))?.focus());
    }
    tabId(index) {
        return `${this.block().id}-tab-${index}`;
    }
    panelId(index) {
        return `${this.block().id}-tabpanel-${index}`;
    }
    childComponent(child) {
        return this.registry.resolve(child);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: InteractiveBlockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: InteractiveBlockComponent, isStandalone: true, selector: "headless-interactive-block", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "@switch (block().type) {\n  @case ('accordion') {\n    <mat-accordion class=\"interactive-accordion\" [multi]=\"data().allowMultiple ?? true\">\n      @for (item of data().items ?? []; track item.id) {\n        <mat-expansion-panel [expanded]=\"item.expanded ?? false\">\n          <mat-expansion-panel-header>\n            <mat-panel-title>{{ item.title }}</mat-panel-title>\n          </mat-expansion-panel-header>\n          <section class=\"interactive-accordion__content\" [attr.aria-label]=\"item.title\">\n            @for (child of item.blocks; track child.id + '-' + $index) {\n              <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n            }\n          </section>\n        </mat-expansion-panel>\n      }\n    </mat-accordion>\n  }\n  @case ('tabs') {\n    <section class=\"interactive-tabs\" [ngClass]=\"classes()\" [class.interactive-tabs--vertical]=\"data().orientation === 'vertical'\" [ngStyle]=\"styles()\">\n      @if (data().title) { <h2 class=\"interactive-tabs__title\">{{ data().title }}</h2> }\n      @if (!isMobile() && data().orientation === 'vertical') {\n        <div class=\"interactive-tabs__layout\">\n          <div class=\"interactive-tabs__list\" role=\"tablist\" [attr.aria-orientation]=\"data().orientation\">\n            @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n              <button\n                class=\"interactive-tabs__tab\"\n                type=\"button\"\n                role=\"tab\"\n                [id]=\"tabId(index)\"\n                [attr.aria-selected]=\"activeTab() === index\"\n                [attr.aria-controls]=\"panelId(index)\"\n                [attr.tabindex]=\"activeTab() === index ? 0 : -1\"\n                (click)=\"selectTab(index)\"\n                (keydown)=\"onTabKeydown($event, index)\"\n              >\n                @if (tab.icon) { <mat-icon aria-hidden=\"true\">{{ tab.icon }}</mat-icon> }\n                <span>{{ tab.label }}</span>\n              </button>\n            }\n          </div>\n          <div class=\"interactive-tabs__panels\">\n            @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n              @if (activeTab() === index) {\n                <section class=\"interactive-tabs__content\" role=\"tabpanel\" tabindex=\"0\" [id]=\"panelId(index)\" [attr.aria-labelledby]=\"tabId(index)\">\n                  @for (child of tab.blocks; track child.id + '-' + $index) {\n                    <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n                  }\n                </section>\n              }\n            }\n          </div>\n        </div>\n      } @else if (!isMobile()) {\n        <mat-tab-group\n          class=\"interactive-tabs__material-tabs\"\n          [selectedIndex]=\"activeTab() < 0 ? 0 : activeTab()\"\n          (selectedIndexChange)=\"selectTab($event)\"\n          [headerPosition]=\"'above'\"\n        >\n          @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n            <mat-tab>\n              <ng-template mat-tab-label>\n                @if (tab.icon) { <mat-icon aria-hidden=\"true\">{{ tab.icon }}</mat-icon> }\n                <span>{{ tab.label }}</span>\n              </ng-template>\n              <section class=\"interactive-tabs__content\">\n                @for (child of tab.blocks; track child.id + '-' + $index) {\n                  <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n                }\n              </section>\n            </mat-tab>\n          }\n        </mat-tab-group>\n      } @else {\n        <mat-accordion class=\"interactive-tabs__mobile-accordion\" [multi]=\"false\">\n          @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n            <mat-expansion-panel\n              [expanded]=\"activeTab() === index\"\n              (opened)=\"openAccordion(index)\"\n              (closed)=\"closeAccordion(index)\"\n            >\n              <mat-expansion-panel-header>\n                <mat-panel-title>\n                  @if (tab.icon) { <mat-icon aria-hidden=\"true\">{{ tab.icon }}</mat-icon> }\n                  <span>{{ tab.label }}</span>\n                </mat-panel-title>\n              </mat-expansion-panel-header>\n              <section class=\"interactive-tabs__content\" [attr.aria-label]=\"tab.label\">\n                @for (child of tab.blocks; track child.id + '-' + $index) {\n                  <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n                }\n              </section>\n            </mat-expansion-panel>\n          }\n        </mat-accordion>\n      }\n    </section>\n  }\n  @case ('gallery') {\n    <section class=\"interactive-gallery\" [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [style.--gallery-columns]=\"data().columns ?? 3\" aria-label=\"Gallery\">\n      @for (image of data().images ?? []; track image.id) {\n        <figure class=\"interactive-gallery__item\">\n          <img [src]=\"image.src\" [alt]=\"image.alt\" loading=\"lazy\" />\n          @if (image.caption) { <figcaption>{{ image.caption }}</figcaption> }\n        </figure>\n      }\n    </section>\n  }\n  @case ('tooltip') {\n    <span class=\"interactive-tooltip\" [matTooltip]=\"data().content ?? ''\" tabindex=\"0\">{{ data().label }}</span>\n  }\n}\n\n\n", styles: [":host{display:block}.interactive-tabs,.interactive-gallery{display:block;width:var(--wp--preset--interactive--width, 100%);height:var(--wp--preset--interactive--height, auto);color:var(--wp--preset--interactive--color, inherit);box-shadow:var(--wp--preset--interactive--box-shadow, none)}.interactive-tabs{border:var(--wp--preset--interactive-tabs--border, 0);border-radius:var(--wp--preset--interactive--border-radius, 0)}.interactive-tabs__title{margin:var(--wp--preset--interactive-tabs--title-margin, 0 0 1.25rem)}.interactive-tabs__material-tabs,.interactive-tabs__mobile-accordion{display:block;width:100%}.interactive-tabs__material-tabs{--mat-tab-header-label-text-size: inherit}.interactive-tabs__layout{display:grid;gap:var(--wp--preset--interactive--gap, 1.5rem)}.interactive-tabs__list{display:flex;flex-wrap:wrap;gap:var(--wp--preset--interactive-tabs--list-gap, .5rem)}.interactive-tabs__tab{align-items:center;background:var(--wp--preset--interactive--background, transparent);border:var(--wp--preset--interactive--border, 0);border-bottom:var(--wp--preset--interactive-tabs--tab-border-bottom, 2px solid transparent);color:inherit;cursor:pointer;display:inline-flex;gap:var(--wp--preset--interactive-tabs--tab-gap, .5rem);height:var(--wp--preset--interactive--height, auto);min-height:var(--wp--preset--interactive-tabs--tab-min-height, 44px);padding:var(--wp--preset--interactive-tabs--tab-padding, .75rem 1rem);text-align:left}.interactive-tabs__tab[aria-selected=true]{border-bottom-color:var(--wp--preset--interactive-tabs--tab-active-border-color, var(--wp--preset--color--accent-2, currentColor));font-weight:700}.interactive-tabs__tab:focus-visible{outline:var(--wp--preset--interactive-tabs--tab-focus-outline, 3px solid currentColor);outline-offset:var(--wp--preset--interactive-tabs--tab-focus-outline-offset, 2px)}.interactive-tabs__tab mat-icon{font-size:var(--wp--preset--interactive-tabs--icon-size, 1.25rem);height:var(--wp--preset--interactive-tabs--icon-size, 1.25rem);width:var(--wp--preset--interactive-tabs--icon-size, 1.25rem)}.interactive-tabs__content{min-width:0;padding:var(--wp--preset--interactive-tabs--content-padding, 1.25rem 0)}.interactive-tabs__material-tabs mat-icon,.interactive-tabs__mobile-accordion mat-icon{margin-right:.5rem}.interactive-tabs--vertical .interactive-tabs__layout{grid-template-columns:var(--wp--preset--interactive-tabs--vertical-columns, minmax(12rem, 18rem) minmax(0, 1fr))}.interactive-tabs--vertical .interactive-tabs__list{align-content:start;display:grid;gap:var(--wp--preset--interactive-tabs--vertical-list-gap, .35rem)}.interactive-tabs--vertical .interactive-tabs__tab{border-bottom:0;border-left:var(--wp--preset--interactive-tabs--tab-border-left, 3px solid transparent);border-radius:var(--wp--preset--interactive-tabs--tab-border-radius, .25rem);width:var(--wp--preset--interactive--width, 100%)}.interactive-tabs--vertical .interactive-tabs__tab[aria-selected=true]{background:var(--wp--preset--interactive-tabs--tab-active-background, var(--wp--preset--color--accent-5, rgba(0, 0, 0, .05)));border-left-color:var(--wp--preset--interactive-tabs--tab-active-border-color, var(--wp--preset--color--accent-2, currentColor))}.interactive-accordion{display:block;width:var(--wp--preset--interactive--width, 100%)}.interactive-tabs.alignnone,.interactive-gallery.alignnone{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--content-size, 645px)}.interactive-tabs.alignwide,.interactive-gallery.alignwide{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--wide-size, 1340px)}.interactive-tabs.alignfull,.interactive-gallery.alignfull{margin-left:calc(var(--wp--style--root--padding-left, var(--wp--preset--spacing--50)) * -1);margin-right:calc(var(--wp--style--root--padding-right, var(--wp--preset--spacing--50)) * -1);max-width:none;width:var(--wp--preset--interactive--width, 100%)}.interactive-gallery{display:grid;grid-template-columns:var(--wp--preset--interactive-gallery--columns, repeat(var(--gallery-columns, 3), minmax(0, 1fr)));gap:var(--wp--preset--interactive-gallery--gap, 1rem)}.interactive-accordion__content{padding:var(--wp--preset--interactive--padding, .5rem 0)}.interactive-gallery__item{margin:var(--wp--preset--interactive-gallery--item-margin, 0)}.interactive-gallery img{display:block;height:var(--wp--preset--interactive-gallery--image-height, auto);width:var(--wp--preset--interactive-gallery--image-width, 100%)}.interactive-gallery figcaption{padding-top:var(--wp--preset--interactive-gallery--caption-padding-top, .5rem)}.interactive-tooltip{cursor:help;text-decoration:underline dotted}@media(max-width:700px){.interactive-gallery{grid-template-columns:var(--wp--preset--interactive-gallery--columns-mobile, repeat(2, minmax(0, 1fr)))}}@media(max-width:480px){.interactive-gallery{grid-template-columns:var(--wp--preset--interactive-gallery--columns-small, 1fr)}}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: MatExpansionModule }, { kind: "directive", type: i1$2.MatAccordion, selector: "mat-accordion", inputs: ["hideToggle", "displayMode", "togglePosition"], exportAs: ["matAccordion"] }, { kind: "component", type: i1$2.MatExpansionPanel, selector: "mat-expansion-panel", inputs: ["hideToggle", "togglePosition"], outputs: ["afterExpand", "afterCollapse"], exportAs: ["matExpansionPanel"] }, { kind: "component", type: i1$2.MatExpansionPanelHeader, selector: "mat-expansion-panel-header", inputs: ["expandedHeight", "collapsedHeight", "tabIndex"] }, { kind: "directive", type: i1$2.MatExpansionPanelTitle, selector: "mat-panel-title" }, { kind: "ngmodule", type: MatTabsModule }, { kind: "directive", type: i2$1.MatTabLabel, selector: "[mat-tab-label], [matTabLabel]" }, { kind: "component", type: i2$1.MatTab, selector: "mat-tab", inputs: ["disabled", "label", "aria-label", "aria-labelledby", "labelClass", "bodyClass", "id"], exportAs: ["matTab"] }, { kind: "component", type: i2$1.MatTabGroup, selector: "mat-tab-group", inputs: ["color", "fitInkBarToContent", "mat-stretch-tabs", "mat-align-tabs", "dynamicHeight", "selectedIndex", "headerPosition", "animationDuration", "contentTabIndex", "disablePagination", "disableRipple", "preserveContent", "backgroundColor", "aria-label", "aria-labelledby"], outputs: ["selectedIndexChange", "focusChange", "animationDone", "selectedTabChange"], exportAs: ["matTabGroup"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatTooltipModule }, { kind: "directive", type: i4.MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: InteractiveBlockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-interactive-block', imports: [NgClass, NgComponentOutlet, NgStyle, MatExpansionModule, MatTabsModule, MatIconModule, MatTooltipModule], template: "@switch (block().type) {\n  @case ('accordion') {\n    <mat-accordion class=\"interactive-accordion\" [multi]=\"data().allowMultiple ?? true\">\n      @for (item of data().items ?? []; track item.id) {\n        <mat-expansion-panel [expanded]=\"item.expanded ?? false\">\n          <mat-expansion-panel-header>\n            <mat-panel-title>{{ item.title }}</mat-panel-title>\n          </mat-expansion-panel-header>\n          <section class=\"interactive-accordion__content\" [attr.aria-label]=\"item.title\">\n            @for (child of item.blocks; track child.id + '-' + $index) {\n              <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n            }\n          </section>\n        </mat-expansion-panel>\n      }\n    </mat-accordion>\n  }\n  @case ('tabs') {\n    <section class=\"interactive-tabs\" [ngClass]=\"classes()\" [class.interactive-tabs--vertical]=\"data().orientation === 'vertical'\" [ngStyle]=\"styles()\">\n      @if (data().title) { <h2 class=\"interactive-tabs__title\">{{ data().title }}</h2> }\n      @if (!isMobile() && data().orientation === 'vertical') {\n        <div class=\"interactive-tabs__layout\">\n          <div class=\"interactive-tabs__list\" role=\"tablist\" [attr.aria-orientation]=\"data().orientation\">\n            @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n              <button\n                class=\"interactive-tabs__tab\"\n                type=\"button\"\n                role=\"tab\"\n                [id]=\"tabId(index)\"\n                [attr.aria-selected]=\"activeTab() === index\"\n                [attr.aria-controls]=\"panelId(index)\"\n                [attr.tabindex]=\"activeTab() === index ? 0 : -1\"\n                (click)=\"selectTab(index)\"\n                (keydown)=\"onTabKeydown($event, index)\"\n              >\n                @if (tab.icon) { <mat-icon aria-hidden=\"true\">{{ tab.icon }}</mat-icon> }\n                <span>{{ tab.label }}</span>\n              </button>\n            }\n          </div>\n          <div class=\"interactive-tabs__panels\">\n            @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n              @if (activeTab() === index) {\n                <section class=\"interactive-tabs__content\" role=\"tabpanel\" tabindex=\"0\" [id]=\"panelId(index)\" [attr.aria-labelledby]=\"tabId(index)\">\n                  @for (child of tab.blocks; track child.id + '-' + $index) {\n                    <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n                  }\n                </section>\n              }\n            }\n          </div>\n        </div>\n      } @else if (!isMobile()) {\n        <mat-tab-group\n          class=\"interactive-tabs__material-tabs\"\n          [selectedIndex]=\"activeTab() < 0 ? 0 : activeTab()\"\n          (selectedIndexChange)=\"selectTab($event)\"\n          [headerPosition]=\"'above'\"\n        >\n          @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n            <mat-tab>\n              <ng-template mat-tab-label>\n                @if (tab.icon) { <mat-icon aria-hidden=\"true\">{{ tab.icon }}</mat-icon> }\n                <span>{{ tab.label }}</span>\n              </ng-template>\n              <section class=\"interactive-tabs__content\">\n                @for (child of tab.blocks; track child.id + '-' + $index) {\n                  <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n                }\n              </section>\n            </mat-tab>\n          }\n        </mat-tab-group>\n      } @else {\n        <mat-accordion class=\"interactive-tabs__mobile-accordion\" [multi]=\"false\">\n          @for (tab of data().tabs ?? []; track tab.id; let index = $index) {\n            <mat-expansion-panel\n              [expanded]=\"activeTab() === index\"\n              (opened)=\"openAccordion(index)\"\n              (closed)=\"closeAccordion(index)\"\n            >\n              <mat-expansion-panel-header>\n                <mat-panel-title>\n                  @if (tab.icon) { <mat-icon aria-hidden=\"true\">{{ tab.icon }}</mat-icon> }\n                  <span>{{ tab.label }}</span>\n                </mat-panel-title>\n              </mat-expansion-panel-header>\n              <section class=\"interactive-tabs__content\" [attr.aria-label]=\"tab.label\">\n                @for (child of tab.blocks; track child.id + '-' + $index) {\n                  <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n                }\n              </section>\n            </mat-expansion-panel>\n          }\n        </mat-accordion>\n      }\n    </section>\n  }\n  @case ('gallery') {\n    <section class=\"interactive-gallery\" [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [style.--gallery-columns]=\"data().columns ?? 3\" aria-label=\"Gallery\">\n      @for (image of data().images ?? []; track image.id) {\n        <figure class=\"interactive-gallery__item\">\n          <img [src]=\"image.src\" [alt]=\"image.alt\" loading=\"lazy\" />\n          @if (image.caption) { <figcaption>{{ image.caption }}</figcaption> }\n        </figure>\n      }\n    </section>\n  }\n  @case ('tooltip') {\n    <span class=\"interactive-tooltip\" [matTooltip]=\"data().content ?? ''\" tabindex=\"0\">{{ data().label }}</span>\n  }\n}\n\n\n", styles: [":host{display:block}.interactive-tabs,.interactive-gallery{display:block;width:var(--wp--preset--interactive--width, 100%);height:var(--wp--preset--interactive--height, auto);color:var(--wp--preset--interactive--color, inherit);box-shadow:var(--wp--preset--interactive--box-shadow, none)}.interactive-tabs{border:var(--wp--preset--interactive-tabs--border, 0);border-radius:var(--wp--preset--interactive--border-radius, 0)}.interactive-tabs__title{margin:var(--wp--preset--interactive-tabs--title-margin, 0 0 1.25rem)}.interactive-tabs__material-tabs,.interactive-tabs__mobile-accordion{display:block;width:100%}.interactive-tabs__material-tabs{--mat-tab-header-label-text-size: inherit}.interactive-tabs__layout{display:grid;gap:var(--wp--preset--interactive--gap, 1.5rem)}.interactive-tabs__list{display:flex;flex-wrap:wrap;gap:var(--wp--preset--interactive-tabs--list-gap, .5rem)}.interactive-tabs__tab{align-items:center;background:var(--wp--preset--interactive--background, transparent);border:var(--wp--preset--interactive--border, 0);border-bottom:var(--wp--preset--interactive-tabs--tab-border-bottom, 2px solid transparent);color:inherit;cursor:pointer;display:inline-flex;gap:var(--wp--preset--interactive-tabs--tab-gap, .5rem);height:var(--wp--preset--interactive--height, auto);min-height:var(--wp--preset--interactive-tabs--tab-min-height, 44px);padding:var(--wp--preset--interactive-tabs--tab-padding, .75rem 1rem);text-align:left}.interactive-tabs__tab[aria-selected=true]{border-bottom-color:var(--wp--preset--interactive-tabs--tab-active-border-color, var(--wp--preset--color--accent-2, currentColor));font-weight:700}.interactive-tabs__tab:focus-visible{outline:var(--wp--preset--interactive-tabs--tab-focus-outline, 3px solid currentColor);outline-offset:var(--wp--preset--interactive-tabs--tab-focus-outline-offset, 2px)}.interactive-tabs__tab mat-icon{font-size:var(--wp--preset--interactive-tabs--icon-size, 1.25rem);height:var(--wp--preset--interactive-tabs--icon-size, 1.25rem);width:var(--wp--preset--interactive-tabs--icon-size, 1.25rem)}.interactive-tabs__content{min-width:0;padding:var(--wp--preset--interactive-tabs--content-padding, 1.25rem 0)}.interactive-tabs__material-tabs mat-icon,.interactive-tabs__mobile-accordion mat-icon{margin-right:.5rem}.interactive-tabs--vertical .interactive-tabs__layout{grid-template-columns:var(--wp--preset--interactive-tabs--vertical-columns, minmax(12rem, 18rem) minmax(0, 1fr))}.interactive-tabs--vertical .interactive-tabs__list{align-content:start;display:grid;gap:var(--wp--preset--interactive-tabs--vertical-list-gap, .35rem)}.interactive-tabs--vertical .interactive-tabs__tab{border-bottom:0;border-left:var(--wp--preset--interactive-tabs--tab-border-left, 3px solid transparent);border-radius:var(--wp--preset--interactive-tabs--tab-border-radius, .25rem);width:var(--wp--preset--interactive--width, 100%)}.interactive-tabs--vertical .interactive-tabs__tab[aria-selected=true]{background:var(--wp--preset--interactive-tabs--tab-active-background, var(--wp--preset--color--accent-5, rgba(0, 0, 0, .05)));border-left-color:var(--wp--preset--interactive-tabs--tab-active-border-color, var(--wp--preset--color--accent-2, currentColor))}.interactive-accordion{display:block;width:var(--wp--preset--interactive--width, 100%)}.interactive-tabs.alignnone,.interactive-gallery.alignnone{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--content-size, 645px)}.interactive-tabs.alignwide,.interactive-gallery.alignwide{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--wide-size, 1340px)}.interactive-tabs.alignfull,.interactive-gallery.alignfull{margin-left:calc(var(--wp--style--root--padding-left, var(--wp--preset--spacing--50)) * -1);margin-right:calc(var(--wp--style--root--padding-right, var(--wp--preset--spacing--50)) * -1);max-width:none;width:var(--wp--preset--interactive--width, 100%)}.interactive-gallery{display:grid;grid-template-columns:var(--wp--preset--interactive-gallery--columns, repeat(var(--gallery-columns, 3), minmax(0, 1fr)));gap:var(--wp--preset--interactive-gallery--gap, 1rem)}.interactive-accordion__content{padding:var(--wp--preset--interactive--padding, .5rem 0)}.interactive-gallery__item{margin:var(--wp--preset--interactive-gallery--item-margin, 0)}.interactive-gallery img{display:block;height:var(--wp--preset--interactive-gallery--image-height, auto);width:var(--wp--preset--interactive-gallery--image-width, 100%)}.interactive-gallery figcaption{padding-top:var(--wp--preset--interactive-gallery--caption-padding-top, .5rem)}.interactive-tooltip{cursor:help;text-decoration:underline dotted}@media(max-width:700px){.interactive-gallery{grid-template-columns:var(--wp--preset--interactive-gallery--columns-mobile, repeat(2, minmax(0, 1fr)))}}@media(max-width:480px){.interactive-gallery{grid-template-columns:var(--wp--preset--interactive-gallery--columns-small, 1fr)}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

const HEADLESS_ANGULAR_CONFIG = new InjectionToken('HEADLESS_ANGULAR_CONFIG');
const HEADLESS_CONTENT_CLIENT = new InjectionToken('HEADLESS_CONTENT_CLIENT');
function provideHeadlessAngular(config = {}, ...features) {
    return makeEnvironmentProviders([
        { provide: HEADLESS_ANGULAR_CONFIG, useValue: { renderPageTitle: true, ...config } },
        ...(config.contentClient ? [{ provide: HEADLESS_CONTENT_CLIENT, useValue: config.contentClient }] : []),
        {
            provide: BlockComponentRegistry,
            useFactory: () => new BlockComponentRegistry(config.blocks ?? [], config.unsupportedBlocks),
        },
        ...features,
    ]);
}

class FormService {
    client = inject(HEADLESS_CONTENT_CLIENT, { optional: true });
    submit(formId, values, nonce) {
        if (!this.client)
            throw new Error('No ContentClient configured for form submission.');
        return from(this.client.submitForm(formId, values, nonce));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FormService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FormService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class FormComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    formService = inject(FormService);
    styleService = inject(SafeStyleService);
    submitting = signal(false, ...(ngDevMode ? [{ debugName: "submitting" }] : /* istanbul ignore next */ []));
    errorMessage = signal(null, ...(ngDevMode ? [{ debugName: "errorMessage" }] : /* istanbul ignore next */ []));
    successMessage = signal(null, ...(ngDevMode ? [{ debugName: "successMessage" }] : /* istanbul ignore next */ []));
    data = computed(() => this.block().data, ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    styles = computed(() => this.styleService.toInlineStyles(this.block().style), ...(ngDevMode ? [{ debugName: "styles" }] : /* istanbul ignore next */ []));
    form = computed(() => {
        const controls = {};
        for (const field of this.data().fields) {
            const validators = [];
            if (field.required)
                validators.push(Validators.required);
            if (field.type === 'email')
                validators.push(Validators.email);
            controls[field.name] = new FormControl(field.type === 'checkbox' ? [] : '', validators);
        }
        return new FormGroup(controls);
    }, ...(ngDevMode ? [{ debugName: "form" }] : /* istanbul ignore next */ []));
    control(field) {
        return this.form().controls[field.name];
    }
    isChecked(field, value) {
        const selected = this.control(field).value;
        return Array.isArray(selected) && selected.includes(value);
    }
    toggleCheckbox(field, value, checked) {
        const selected = Array.isArray(this.control(field).value) ? [...this.control(field).value] : [];
        const next = checked ? [...new Set([...selected, value])] : selected.filter((item) => item !== value);
        this.control(field).setValue(next);
        this.control(field).markAsDirty();
    }
    submit() {
        if (this.form().invalid || this.submitting()) {
            this.form().markAllAsTouched();
            return;
        }
        this.submitting.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);
        this.formService.submit(this.data().formId, this.form().getRawValue(), this.data().submit.nonce).subscribe({
            next: (response) => {
                this.submitting.set(false);
                this.successMessage.set(response.message ?? this.data().successMessage ?? 'Your form has been submitted successfully.');
                this.form().reset();
            },
            error: (error) => {
                this.submitting.set(false);
                this.errorMessage.set(error.error?.message ?? this.data().failureMessage ?? 'The form could not be submitted.');
            },
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FormComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: FormComponent, isStandalone: true, selector: "headless-form", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "<form class=\"headless-form\" [ngClass]=\"block().align ? 'align-' + block().align : ''\" [ngStyle]=\"styles()\" [formGroup]=\"form()\" (ngSubmit)=\"submit()\" novalidate>\n  @if (successMessage()) {\n    <div class=\"headless-form__message headless-form__message--success\" role=\"status\" aria-live=\"polite\">\n      <mat-icon aria-hidden=\"true\">check_circle</mat-icon>\n      <span>{{ successMessage() }}</span>\n    </div>\n  }\n  @if (errorMessage()) {\n    <div class=\"headless-form__message headless-form__message--error\" role=\"alert\" aria-live=\"assertive\">\n      <mat-icon aria-hidden=\"true\">error</mat-icon>\n      <span>{{ errorMessage() }}</span>\n    </div>\n  }\n\n  @for (field of data().fields; track field.name) {\n    @switch (field.type) {\n      @case ('textarea') {\n        <mat-form-field appearance=\"outline\">\n          <mat-label>{{ field.label }}</mat-label>\n          <textarea matInput [formControlName]=\"field.name\" [placeholder]=\"field.placeholder ?? ''\" [attr.aria-describedby]=\"field.hint ? field.name + '-hint' : null\" rows=\"4\"></textarea>\n          @if (field.hint) { <mat-hint [id]=\"field.name + '-hint'\">{{ field.hint }}</mat-hint> }\n          @if (control(field).hasError('required') && control(field).touched) { <mat-error>This field is required.</mat-error> }\n        </mat-form-field>\n      }\n      @case ('select') {\n        <mat-form-field appearance=\"outline\">\n          <mat-label>{{ field.label }}</mat-label>\n          <mat-select [formControlName]=\"field.name\">\n            @for (option of field.options ?? []; track option.value) { <mat-option [value]=\"option.value\">{{ option.label }}</mat-option> }\n          </mat-select>\n          @if (field.hint) { <mat-hint>{{ field.hint }}</mat-hint> }\n          @if (control(field).hasError('required') && control(field).touched) { <mat-error>This field is required.</mat-error> }\n        </mat-form-field>\n      }\n      @case ('radio') {\n        <fieldset class=\"headless-form__choice-group\">\n          <legend>{{ field.label }}</legend>\n          <mat-radio-group [formControlName]=\"field.name\" [attr.aria-describedby]=\"field.hint ? field.name + '-hint' : null\">\n            @for (option of field.options ?? []; track option.value) { <mat-radio-button [value]=\"option.value\">{{ option.label }}</mat-radio-button> }\n          </mat-radio-group>\n          @if (field.hint) { <span class=\"headless-form__hint\" [id]=\"field.name + '-hint'\">{{ field.hint }}</span> }\n        </fieldset>\n      }\n      @case ('checkbox') {\n        <div class=\"headless-form__checkboxes\">\n          <span class=\"headless-form__label\">{{ field.label }}</span>\n          @for (option of field.options ?? []; track option.value) { <mat-checkbox [checked]=\"isChecked(field, option.value)\" (change)=\"toggleCheckbox(field, option.value, $event.checked)\">{{ option.label }}</mat-checkbox> }\n          @if (field.hint) { <span class=\"headless-form__hint\">{{ field.hint }}</span> }\n        </div>\n      }\n      @default {\n        <mat-form-field appearance=\"outline\">\n          <mat-label>{{ field.label }}</mat-label>\n          <input matInput [type]=\"field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'\" [formControlName]=\"field.name\" [placeholder]=\"field.placeholder ?? ''\" [attr.aria-describedby]=\"field.hint ? field.name + '-hint' : null\" />\n          @if (field.hint) { <mat-hint [id]=\"field.name + '-hint'\">{{ field.hint }}</mat-hint> }\n          @if (control(field).hasError('required') && control(field).touched) { <mat-error>This field is required.</mat-error> }\n          @if (control(field).hasError('email') && control(field).touched) { <mat-error>Enter a valid email address.</mat-error> }\n        </mat-form-field>\n      }\n    }\n  }\n\n  <button mat-flat-button type=\"submit\" color=\"primary\" [disabled]=\"submitting()\">\n    @if (submitting()) { <mat-spinner diameter=\"20\" aria-label=\"Submitting\"></mat-spinner> }\n    @if (!submitting()) { {{ data().submit.label }} }\n  </button>\n</form>\n\n\n", styles: [":host{display:block;color:var(--wp--preset--form--color, var(--wp--preset--color--contrast, currentColor));font-family:var(--wp--preset--form--font-family, var(--wp--preset--font-family--roboto, Roboto, sans-serif));font-size:var(--wp--preset--form--font-size, var(--wp--preset--font-size--medium, 1rem));line-height:var(--wp--preset--form--line-height, 1.5)}.headless-form{display:grid;gap:var(--wp--preset--form--gap, var(--wp--preset--spacing--40, 1rem))}.headless-form button[type=submit]{background:var(--wp--preset--form--submit-background, var(--wp--preset--color--accent-2, #0b3036));color:var(--wp--preset--form--submit-color, var(--wp--preset--color--base, #fff))}.headless-form mat-form-field{width:100%}.headless-form__choice-group,.headless-form__checkboxes{display:grid;gap:var(--wp--preset--form--choice-gap, var(--wp--preset--spacing--30, .75rem));border:0;margin:var(--wp--preset--form--choice-margin, 0);padding:var(--wp--preset--form--choice-padding, 0)}.headless-form__choice-group mat-radio-group{display:flex;flex-wrap:wrap;gap:var(--wp--preset--form--radio-row-gap, var(--wp--preset--spacing--30, .75rem)) var(--wp--preset--form--radio-column-gap, var(--wp--preset--spacing--40, 1.25rem))}.headless-form__label,.headless-form__choice-group legend{color:var(--wp--preset--form--label-color, var(--wp--preset--color--contrast, currentColor));font-family:var(--wp--preset--form--label-font-family, inherit);font-size:var(--wp--preset--form--label-font-size, var(--wp--preset--font-size--medium, 1rem));font-weight:var(--wp--preset--form--label-font-weight, 600);line-height:var(--wp--preset--form--label-line-height, 1.4)}.headless-form__hint{color:var(--wp--preset--form--hint-color, var(--wp--preset--color--accent-4, #52606d));font-family:var(--wp--preset--form--hint-font-family, inherit);font-size:var(--wp--preset--form--hint-font-size, var(--wp--preset--font-size--small, .875rem));line-height:var(--wp--preset--form--hint-line-height, 1.4)}.headless-form__message{align-items:var(--wp--preset--form--message-align-items, flex-start);border:var(--wp--preset--form--message-border-width, 1px) var(--wp--preset--form--message-border-style, solid) currentColor;display:flex;gap:var(--wp--preset--form--message-gap, var(--wp--preset--spacing--30, .75rem));font-family:var(--wp--preset--form--message-font-family, inherit);font-size:var(--wp--preset--form--message-font-size, var(--wp--preset--font-size--medium, 1rem));line-height:var(--wp--preset--form--message-line-height, 1.5);padding:var(--wp--preset--form--message-padding-block, var(--wp--preset--spacing--30, .875rem)) var(--wp--preset--form--message-padding-inline, var(--wp--preset--spacing--40, 1rem))}.headless-form__message mat-icon{color:currentColor;flex:0 0 auto;font-size:var(--wp--preset--form--message-icon-size, 1.5rem);height:var(--wp--preset--form--message-icon-size, 1.5rem);width:var(--wp--preset--form--message-icon-size, 1.5rem)}.headless-form__message--success{background:var(--wp--preset--form--success-background, #e8f5e9);border-color:var(--wp--preset--form--success-border, var(--wp--preset--color--accent-1, #2e7d32));color:var(--wp--preset--form--success-color, var(--wp--preset--color--contrast, #1b5e20))}.headless-form__message--error{background:var(--wp--preset--form--error-background, #ffebee);border-color:var(--wp--preset--form--error-border, var(--wp--preset--color--accent-1, #c62828));color:var(--wp--preset--form--error-color, var(--wp--preset--color--contrast, #8e0000))}.headless-form mat-spinner{display:inline-block;height:var(--wp--preset--form--spinner-size, 1.25rem);width:var(--wp--preset--form--spinner-size, 1.25rem)}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1$3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1$3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1$3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i1.MatButton, selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ", inputs: ["matButton"], exportAs: ["matButton", "matAnchor"] }, { kind: "ngmodule", type: MatCheckboxModule }, { kind: "component", type: i3.MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "aria-expanded", "aria-controls", "aria-owns", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i4$1.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i4$1.MatLabel, selector: "mat-label" }, { kind: "directive", type: i4$1.MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "directive", type: i4$1.MatError, selector: "mat-error, [matError]", inputs: ["id"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatInputModule }, { kind: "directive", type: i6.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly", "disabledInteractive"], exportAs: ["matInput"] }, { kind: "ngmodule", type: MatProgressSpinnerModule }, { kind: "component", type: i7.MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "ngmodule", type: MatRadioModule }, { kind: "directive", type: i8.MatRadioGroup, selector: "mat-radio-group", inputs: ["color", "name", "labelPosition", "value", "selected", "disabled", "required", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioGroup"] }, { kind: "component", type: i8.MatRadioButton, selector: "mat-radio-button", inputs: ["id", "name", "aria-label", "aria-labelledby", "aria-describedby", "disableRipple", "tabIndex", "checked", "value", "labelPosition", "disabled", "required", "color", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioButton"] }, { kind: "ngmodule", type: MatSelectModule }, { kind: "component", type: i9.MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth", "canSelectNullableOptions"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "component", type: i9.MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: FormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-form', imports: [NgClass, NgStyle, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule], template: "<form class=\"headless-form\" [ngClass]=\"block().align ? 'align-' + block().align : ''\" [ngStyle]=\"styles()\" [formGroup]=\"form()\" (ngSubmit)=\"submit()\" novalidate>\n  @if (successMessage()) {\n    <div class=\"headless-form__message headless-form__message--success\" role=\"status\" aria-live=\"polite\">\n      <mat-icon aria-hidden=\"true\">check_circle</mat-icon>\n      <span>{{ successMessage() }}</span>\n    </div>\n  }\n  @if (errorMessage()) {\n    <div class=\"headless-form__message headless-form__message--error\" role=\"alert\" aria-live=\"assertive\">\n      <mat-icon aria-hidden=\"true\">error</mat-icon>\n      <span>{{ errorMessage() }}</span>\n    </div>\n  }\n\n  @for (field of data().fields; track field.name) {\n    @switch (field.type) {\n      @case ('textarea') {\n        <mat-form-field appearance=\"outline\">\n          <mat-label>{{ field.label }}</mat-label>\n          <textarea matInput [formControlName]=\"field.name\" [placeholder]=\"field.placeholder ?? ''\" [attr.aria-describedby]=\"field.hint ? field.name + '-hint' : null\" rows=\"4\"></textarea>\n          @if (field.hint) { <mat-hint [id]=\"field.name + '-hint'\">{{ field.hint }}</mat-hint> }\n          @if (control(field).hasError('required') && control(field).touched) { <mat-error>This field is required.</mat-error> }\n        </mat-form-field>\n      }\n      @case ('select') {\n        <mat-form-field appearance=\"outline\">\n          <mat-label>{{ field.label }}</mat-label>\n          <mat-select [formControlName]=\"field.name\">\n            @for (option of field.options ?? []; track option.value) { <mat-option [value]=\"option.value\">{{ option.label }}</mat-option> }\n          </mat-select>\n          @if (field.hint) { <mat-hint>{{ field.hint }}</mat-hint> }\n          @if (control(field).hasError('required') && control(field).touched) { <mat-error>This field is required.</mat-error> }\n        </mat-form-field>\n      }\n      @case ('radio') {\n        <fieldset class=\"headless-form__choice-group\">\n          <legend>{{ field.label }}</legend>\n          <mat-radio-group [formControlName]=\"field.name\" [attr.aria-describedby]=\"field.hint ? field.name + '-hint' : null\">\n            @for (option of field.options ?? []; track option.value) { <mat-radio-button [value]=\"option.value\">{{ option.label }}</mat-radio-button> }\n          </mat-radio-group>\n          @if (field.hint) { <span class=\"headless-form__hint\" [id]=\"field.name + '-hint'\">{{ field.hint }}</span> }\n        </fieldset>\n      }\n      @case ('checkbox') {\n        <div class=\"headless-form__checkboxes\">\n          <span class=\"headless-form__label\">{{ field.label }}</span>\n          @for (option of field.options ?? []; track option.value) { <mat-checkbox [checked]=\"isChecked(field, option.value)\" (change)=\"toggleCheckbox(field, option.value, $event.checked)\">{{ option.label }}</mat-checkbox> }\n          @if (field.hint) { <span class=\"headless-form__hint\">{{ field.hint }}</span> }\n        </div>\n      }\n      @default {\n        <mat-form-field appearance=\"outline\">\n          <mat-label>{{ field.label }}</mat-label>\n          <input matInput [type]=\"field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'\" [formControlName]=\"field.name\" [placeholder]=\"field.placeholder ?? ''\" [attr.aria-describedby]=\"field.hint ? field.name + '-hint' : null\" />\n          @if (field.hint) { <mat-hint [id]=\"field.name + '-hint'\">{{ field.hint }}</mat-hint> }\n          @if (control(field).hasError('required') && control(field).touched) { <mat-error>This field is required.</mat-error> }\n          @if (control(field).hasError('email') && control(field).touched) { <mat-error>Enter a valid email address.</mat-error> }\n        </mat-form-field>\n      }\n    }\n  }\n\n  <button mat-flat-button type=\"submit\" color=\"primary\" [disabled]=\"submitting()\">\n    @if (submitting()) { <mat-spinner diameter=\"20\" aria-label=\"Submitting\"></mat-spinner> }\n    @if (!submitting()) { {{ data().submit.label }} }\n  </button>\n</form>\n\n\n", styles: [":host{display:block;color:var(--wp--preset--form--color, var(--wp--preset--color--contrast, currentColor));font-family:var(--wp--preset--form--font-family, var(--wp--preset--font-family--roboto, Roboto, sans-serif));font-size:var(--wp--preset--form--font-size, var(--wp--preset--font-size--medium, 1rem));line-height:var(--wp--preset--form--line-height, 1.5)}.headless-form{display:grid;gap:var(--wp--preset--form--gap, var(--wp--preset--spacing--40, 1rem))}.headless-form button[type=submit]{background:var(--wp--preset--form--submit-background, var(--wp--preset--color--accent-2, #0b3036));color:var(--wp--preset--form--submit-color, var(--wp--preset--color--base, #fff))}.headless-form mat-form-field{width:100%}.headless-form__choice-group,.headless-form__checkboxes{display:grid;gap:var(--wp--preset--form--choice-gap, var(--wp--preset--spacing--30, .75rem));border:0;margin:var(--wp--preset--form--choice-margin, 0);padding:var(--wp--preset--form--choice-padding, 0)}.headless-form__choice-group mat-radio-group{display:flex;flex-wrap:wrap;gap:var(--wp--preset--form--radio-row-gap, var(--wp--preset--spacing--30, .75rem)) var(--wp--preset--form--radio-column-gap, var(--wp--preset--spacing--40, 1.25rem))}.headless-form__label,.headless-form__choice-group legend{color:var(--wp--preset--form--label-color, var(--wp--preset--color--contrast, currentColor));font-family:var(--wp--preset--form--label-font-family, inherit);font-size:var(--wp--preset--form--label-font-size, var(--wp--preset--font-size--medium, 1rem));font-weight:var(--wp--preset--form--label-font-weight, 600);line-height:var(--wp--preset--form--label-line-height, 1.4)}.headless-form__hint{color:var(--wp--preset--form--hint-color, var(--wp--preset--color--accent-4, #52606d));font-family:var(--wp--preset--form--hint-font-family, inherit);font-size:var(--wp--preset--form--hint-font-size, var(--wp--preset--font-size--small, .875rem));line-height:var(--wp--preset--form--hint-line-height, 1.4)}.headless-form__message{align-items:var(--wp--preset--form--message-align-items, flex-start);border:var(--wp--preset--form--message-border-width, 1px) var(--wp--preset--form--message-border-style, solid) currentColor;display:flex;gap:var(--wp--preset--form--message-gap, var(--wp--preset--spacing--30, .75rem));font-family:var(--wp--preset--form--message-font-family, inherit);font-size:var(--wp--preset--form--message-font-size, var(--wp--preset--font-size--medium, 1rem));line-height:var(--wp--preset--form--message-line-height, 1.5);padding:var(--wp--preset--form--message-padding-block, var(--wp--preset--spacing--30, .875rem)) var(--wp--preset--form--message-padding-inline, var(--wp--preset--spacing--40, 1rem))}.headless-form__message mat-icon{color:currentColor;flex:0 0 auto;font-size:var(--wp--preset--form--message-icon-size, 1.5rem);height:var(--wp--preset--form--message-icon-size, 1.5rem);width:var(--wp--preset--form--message-icon-size, 1.5rem)}.headless-form__message--success{background:var(--wp--preset--form--success-background, #e8f5e9);border-color:var(--wp--preset--form--success-border, var(--wp--preset--color--accent-1, #2e7d32));color:var(--wp--preset--form--success-color, var(--wp--preset--color--contrast, #1b5e20))}.headless-form__message--error{background:var(--wp--preset--form--error-background, #ffebee);border-color:var(--wp--preset--form--error-border, var(--wp--preset--color--accent-1, #c62828));color:var(--wp--preset--form--error-color, var(--wp--preset--color--contrast, #8e0000))}.headless-form mat-spinner{display:inline-block;height:var(--wp--preset--form--spinner-size, 1.25rem);width:var(--wp--preset--form--spinner-size, 1.25rem)}\n"] }]
        }], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

function lazyRegistration(type, component) {
    return {
        type,
        get component() {
            return component();
        },
    };
}
const DEFAULT_ANGULAR_BLOCKS = [
    ...['container', 'text', 'image', 'link', 'spacer', 'details', 'separator'].map((type) => lazyRegistration(type, () => BasicBlockComponent)),
    lazyRegistration('hero', () => HeroComponent),
    lazyRegistration('featured-cards', () => FeaturedCardsComponent),
    lazyRegistration('timeline', () => TimelineComponent),
    ...['tabs', 'accordion', 'gallery', 'tooltip'].map((type) => lazyRegistration(type, () => InteractiveBlockComponent)),
    lazyRegistration('form', () => FormComponent),
];
class BlockComponentRegistry {
    components = new Map();
    fallback;
    strategy;
    constructor(registrations = [], unsupported = {}) {
        this.fallback = unsupported.component ?? UnsupportedBlockComponent;
        this.strategy = unsupported.strategy ?? 'fallback';
        this.registerMany(DEFAULT_ANGULAR_BLOCKS);
        this.registerMany(registrations);
    }
    register(type, component) { this.components.set(type, component); }
    registerMany(registrations) { registrations.forEach(({ type, component }) => this.register(type, component)); }
    unregister(type) { return this.components.delete(type); }
    has(type) { return this.components.has(type); }
    resolve(block) {
        const component = this.components.get(block.type);
        if (component)
            return component;
        if (this.strategy === 'error')
            throw new Error(`Unsupported block type: ${block.type}`);
        return this.strategy === 'skip' ? EmptyBlockComponent : this.fallback;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: BlockComponentRegistry, deps: "invalid", target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: BlockComponentRegistry, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: BlockComponentRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined }, { type: undefined }] });
class EmptyBlockComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: EmptyBlockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: EmptyBlockComponent, isStandalone: true, selector: "ng-component", ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: EmptyBlockComponent, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }] });

class GridComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    viewport;
    previous;
    next;
    pagination;
    platformId = inject(PLATFORM_ID);
    registry = inject(BlockComponentRegistry);
    styleService = inject(SafeStyleService);
    injector = inject(Injector);
    observer;
    onWindowResize = () => this.recalculate();
    swiper;
    viewReady = false;
    sliderActive = signal(false, ...(ngDevMode ? [{ debugName: "sliderActive" }] : /* istanbul ignore next */ []));
    responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`, ...(ngDevMode ? [{ debugName: "responsiveClass" }] : /* istanbul ignore next */ []));
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
    classes() {
        return {
            'basic-block': true,
            [this.responsiveClass()]: true,
            'basic-block--layout-grid': true,
            'grid-viewport': true,
            'grid-viewport--slider': this.sliderActive(),
        };
    }
    responsiveStyles() {
        const properties = [
            'gridTemplateColumns', 'gap', 'display', 'alignItems', 'justifyContent',
        ];
        return this.styleService.responsiveCss(this.block().style, `.${this.responsiveClass()}.${this.responsiveClass()}`, properties) + this.styleService.responsiveCss(this.block().style, `.${this.responsiveClass()}.${this.responsiveClass()} .grid-wrapper`, properties);
    }
    styles() {
        return this.styleService.toInlineStyles(this.block().style, [
            'alignItems', 'background', 'backgroundColor', 'color', 'height', 'minHeight', 'padding', 'margin',
            'justifyContent', 'border', 'borderRadius', 'position', 'width',
        ]);
    }
    wrapperStyles() {
        const gap = this.block().style?.properties?.['gap'];
        const styles = {};
        Object.assign(styles, this.styleService.toInlineStyles(this.block().style, ['gridTemplateColumns']));
        if (typeof gap === 'string' || typeof gap === 'number')
            styles['gap'] = gap;
        if (gap && typeof gap === 'object') {
            const value = gap;
            if (value['top'] !== undefined)
                styles['row-gap'] = value['top'];
            if (value['left'] !== undefined)
                styles['column-gap'] = value['left'];
        }
        return styles;
    }
    childComponent(child) { return this.registry.resolve(child); }
    sliderConfigValue() { return this.sliderConfig().minColumnWidth; }
    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId) || !this.viewport)
            return;
        this.viewReady = true;
        if (typeof ResizeObserver !== 'undefined') {
            this.observer = new ResizeObserver(() => this.recalculate());
            this.observer.observe(this.viewport.nativeElement);
        }
        else {
            window.addEventListener('resize', this.onWindowResize, { passive: true });
        }
        this.recalculate();
        requestAnimationFrame(() => this.recalculate());
        window.setTimeout(() => this.recalculate(), 0);
        queueMicrotask(() => this.recalculate());
    }
    ngOnDestroy() {
        this.destroySwiper();
        this.observer?.disconnect();
        if (isPlatformBrowser(this.platformId)) {
            window.removeEventListener('resize', this.onWindowResize);
        }
    }
    recalculate() {
        const viewport = this.viewport?.nativeElement;
        const children = this.block().children ?? [];
        const config = this.sliderConfig();
        const canUseSlider = config.enabled && children.length > 1 && !this.hasUnsupportedPlacement(children);
        const gap = viewport ? this.readGap(viewport) : 0;
        const requiredWidth = children.length * config.minColumnWidth + Math.max(0, children.length - 1) * gap;
        const shouldUseSlider = canUseSlider && !!viewport && viewport.clientWidth < requiredWidth;
        if (shouldUseSlider === this.sliderActive())
            return;
        this.sliderActive.set(shouldUseSlider);
        if (shouldUseSlider)
            queueMicrotask(() => this.createSwiper());
        else
            this.destroySwiper();
    }
    async createSwiper() {
        if (this.swiper || !this.viewport || !this.sliderActive())
            return;
        const [{ default: Swiper }, modules] = await Promise.all([import('swiper'), import('swiper/modules')]);
        if (this.swiper || !this.viewport || !this.sliderActive())
            return;
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
    destroySwiper() { this.swiper?.destroy(true, true); this.swiper = undefined; }
    sliderConfig() {
        const raw = this.block().data.responsiveSlider ?? {};
        const number = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
        const bool = (value, fallback) => typeof value === 'boolean' ? value : fallback;
        return { enabled: bool(raw['enabled'], false), minColumnWidth: number(raw['minColumnWidth'], 280, 120, 800), navigation: bool(raw['navigation'], true), pagination: bool(raw['pagination'], true), loop: bool(raw['loop'], false), autoplay: bool(raw['autoplay'], false), autoplayDelay: number(raw['autoplayDelay'], 5000, 1000, 60000) };
    }
    hasUnsupportedPlacement(children) {
        return children.some((child) => {
            const properties = child.style?.properties;
            return ['columnSpan', 'rowSpan', 'columnStart', 'rowStart'].some((key) => properties?.[key] !== undefined);
        });
    }
    readGap(element) { const gap = parseFloat(getComputedStyle(element).columnGap); return Number.isFinite(gap) ? gap : 0; }
    reducedMotion() { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: GridComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: GridComponent, isStandalone: true, selector: "headless-grid", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, viewQueries: [{ propertyName: "viewport", first: true, predicate: ["viewport"], descendants: true, static: true }, { propertyName: "previous", first: true, predicate: ["previous"], descendants: true, static: true }, { propertyName: "next", first: true, predicate: ["next"], descendants: true, static: true }, { propertyName: "pagination", first: true, predicate: ["pagination"], descendants: true, static: true }], ngImport: i0, template: "<section #viewport [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [style.--headless-slider-column-width.px]=\"sliderConfigValue()\">\n  @if (sliderActive()) {\n    <div class=\"grid-wrapper swiper-wrapper\" [ngStyle]=\"wrapperStyles()\">\n      @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n        <div class=\"grid-item swiper-slide\">\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        </div>\n      }\n    </div>\n  } @else {\n    <div class=\"grid-wrapper\" [ngStyle]=\"wrapperStyles()\">\n      @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n        <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n      }\n    </div>\n  }\n  <button #previous class=\"grid-control grid-control--previous\" type=\"button\" aria-label=\"Previous items\" [hidden]=\"!sliderActive()\">\u2039</button>\n  <button #next class=\"grid-control grid-control--next\" type=\"button\" aria-label=\"Next items\" [hidden]=\"!sliderActive()\">\u203A</button>\n  <div #pagination class=\"grid-pagination\" [hidden]=\"!sliderActive()\"></div>\n</section>\n\n\n", styles: [":host{display:block;width:100%}.grid-viewport{display:block;position:relative;width:100%}.grid-wrapper{display:grid;width:100%}.grid-viewport [hidden]{display:none!important}.grid-item{min-width:0}.grid-viewport--slider{overflow:hidden}.grid-viewport--slider .grid-wrapper{display:flex;flex-wrap:nowrap}.grid-viewport--slider .grid-item{flex:0 0 auto;width:min(100%,var(--headless-slider-column-width, 280px))}.grid-control{align-items:center;background:#fff;border:1px solid currentColor;border-radius:50%;cursor:pointer;display:flex;height:2.5rem;justify-content:center;position:absolute;top:50%;transform:translateY(-50%);width:2.5rem;z-index:2}.grid-control--previous{left:.5rem}.grid-control--next{right:.5rem}.grid-pagination{bottom:.5rem;left:0;position:absolute;right:0;text-align:center;z-index:2}.grid-pagination .swiper-pagination-bullet{background:currentColor;border:0;border-radius:50%;cursor:pointer;display:inline-block;height:.6rem;margin:0 .2rem;opacity:.45;width:.6rem}.grid-pagination .swiper-pagination-bullet-active{opacity:1}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: GridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-grid', imports: [NgClass, NgComponentOutlet, NgStyle], template: "<section #viewport [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [style.--headless-slider-column-width.px]=\"sliderConfigValue()\">\n  @if (sliderActive()) {\n    <div class=\"grid-wrapper swiper-wrapper\" [ngStyle]=\"wrapperStyles()\">\n      @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n        <div class=\"grid-item swiper-slide\">\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        </div>\n      }\n    </div>\n  } @else {\n    <div class=\"grid-wrapper\" [ngStyle]=\"wrapperStyles()\">\n      @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n        <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n      }\n    </div>\n  }\n  <button #previous class=\"grid-control grid-control--previous\" type=\"button\" aria-label=\"Previous items\" [hidden]=\"!sliderActive()\">\u2039</button>\n  <button #next class=\"grid-control grid-control--next\" type=\"button\" aria-label=\"Next items\" [hidden]=\"!sliderActive()\">\u203A</button>\n  <div #pagination class=\"grid-pagination\" [hidden]=\"!sliderActive()\"></div>\n</section>\n\n\n", styles: [":host{display:block;width:100%}.grid-viewport{display:block;position:relative;width:100%}.grid-wrapper{display:grid;width:100%}.grid-viewport [hidden]{display:none!important}.grid-item{min-width:0}.grid-viewport--slider{overflow:hidden}.grid-viewport--slider .grid-wrapper{display:flex;flex-wrap:nowrap}.grid-viewport--slider .grid-item{flex:0 0 auto;width:min(100%,var(--headless-slider-column-width, 280px))}.grid-control{align-items:center;background:#fff;border:1px solid currentColor;border-radius:50%;cursor:pointer;display:flex;height:2.5rem;justify-content:center;position:absolute;top:50%;transform:translateY(-50%);width:2.5rem;z-index:2}.grid-control--previous{left:.5rem}.grid-control--next{right:.5rem}.grid-pagination{bottom:.5rem;left:0;position:absolute;right:0;text-align:center;z-index:2}.grid-pagination .swiper-pagination-bullet{background:currentColor;border:0;border-radius:50%;cursor:pointer;display:inline-block;height:.6rem;margin:0 .2rem;opacity:.45;width:.6rem}.grid-pagination .swiper-pagination-bullet-active{opacity:1}\n"] }]
        }], ctorParameters: () => [], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }], viewport: [{
                type: ViewChild,
                args: ['viewport', { static: true }]
            }], previous: [{
                type: ViewChild,
                args: ['previous', { static: true }]
            }], next: [{
                type: ViewChild,
                args: ['next', { static: true }]
            }], pagination: [{
                type: ViewChild,
                args: ['pagination', { static: true }]
            }] } });

class BasicBlockComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    styleService = inject(SafeStyleService);
    registry = inject(BlockComponentRegistry);
    injector = inject(Injector);
    constructor() {
        effect(() => {
            this.styleService.registerResponsiveStyles(this.responsiveClass(), this.responsiveStyles());
            this.styleService.registerCustomStyles(this.responsiveClass(), this.data().customCss, this.responsiveClass());
        }, { injector: this.injector });
    }
    data = computed(() => this.block().data, ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    childComponent(child) {
        return this.registry.resolve(child);
    }
    responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`, ...(ngDevMode ? [{ debugName: "responsiveClass" }] : /* istanbul ignore next */ []));
    classes = computed(() => {
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
    }, ...(ngDevMode ? [{ debugName: "classes" }] : /* istanbul ignore next */ []));
    responsiveStyles = computed(() => this.styleService.responsiveCss(this.block().style, `.${this.responsiveClass()}.${this.responsiveClass()}`, [
        'minHeight', 'background', 'backgroundColor', 'color', 'fontFamily', 'fontSize', 'fontWeight',
        'letterSpacing', 'textTransform', 'lineHeight', 'fontStyle', 'textDecoration', 'textAlign', 'height',
        'alignItems', 'alignSelf', 'flexDirection', 'flexWrap', 'justifyContent', 'borderColor', 'borderWidth', 'borderStyle', 'border', 'borderTop',
        'borderBottom', 'outline', 'outlineOffset', 'position', 'display', 'objectFit', 'gridTemplateColumns', 'gap',
        'boxShadow',
    ]) + (this.data().layout === 'column'
        ? this.styleService.responsiveCssProperty(this.block().style, 'width', `.${this.responsiveClass()}.${this.responsiveClass()}`, 'flexBasis')
        : ''), ...(ngDevMode ? [{ debugName: "responsiveStyles" }] : /* istanbul ignore next */ []));
    styles = computed(() => {
        const style = this.block().style;
        const styles = {
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
            const corners = borderRadius;
            if (corners['topLeft'])
                styles['border-top-left-radius'] = corners['topLeft'];
            if (corners['topRight'])
                styles['border-top-right-radius'] = corners['topRight'];
            if (corners['bottomRight'])
                styles['border-bottom-right-radius'] = corners['bottomRight'];
            if (corners['bottomLeft'])
                styles['border-bottom-left-radius'] = corners['bottomLeft'];
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
        }
        else if (gap !== undefined && typeof gap === 'object') {
            const axisGap = gap;
            if (typeof axisGap.top === 'string' || typeof axisGap.top === 'number') {
                styles['row-gap'] = axisGap.top;
            }
            if (typeof axisGap.left === 'string' || typeof axisGap.left === 'number') {
                styles['column-gap'] = axisGap.left;
            }
        }
        return styles;
    }, ...(ngDevMode ? [{ debugName: "styles" }] : /* istanbul ignore next */ []));
    overlayStyles = computed(() => {
        const style = this.block().style;
        const styles = {};
        const color = this.styleService.value(style, 'overlayColor');
        const opacity = this.styleService.value(style, 'overlayOpacity');
        if (color !== undefined) {
            styles['background-color'] = color;
        }
        if (opacity !== undefined) {
            styles['opacity'] = opacity;
        }
        return styles;
    }, ...(ngDevMode ? [{ debugName: "overlayStyles" }] : /* istanbul ignore next */ []));
    coverBackgroundChild() {
        const child = this.block().children?.[0];
        return this.data().layout === 'cover' && child?.type === 'image' ? child : undefined;
    }
    coverContentChildren() {
        const children = this.block().children ?? [];
        return this.coverBackgroundChild() === undefined ? children : children.slice(1);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: BasicBlockComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: BasicBlockComponent, isStandalone: true, selector: "headless-basic-block", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "@switch (block().type) {\n  @case ('container') {\n    @if (data().layout === 'grid') {\n      <headless-grid [block]=\"block()\" />\n    } @else if (block().element === 'section') {\n      <section [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </section>\n    } @else if (block().element === 'ul') {\n      <ul [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </ul>\n    } @else if (block().element === 'li') {\n      <li [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @if (data().html ?? data().text) {\n          <span [innerHTML]=\"data().html ?? data().text ?? ''\"></span>\n        }\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </li>\n    } @else if (block().element === 'blockquote') {\n      <blockquote [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </blockquote>\n    } @else if (block().element === 'div' && data().layout === 'html') {\n      <div [ngClass]=\"classes()\" [ngStyle]=\"styles()\">\n        @if (data().attributes?.['id']; as fragmentId) {\n          <a class=\"basic-block__fragment-anchor\" [attr.id]=\"fragmentId\" aria-hidden=\"true\"></a>\n        }\n        <span [innerHTML]=\"data().html ?? ''\"></span>\n      </div>\n    } @else {\n      <div [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @if (data().layout === 'cover') {\n          @if (coverBackgroundChild(); as backgroundChild) {\n            <div class=\"basic-block__cover-background\">\n              <ng-container *ngComponentOutlet=\"childComponent(backgroundChild); inputs: { block: backgroundChild }\" />\n            </div>\n          }\n          <span class=\"basic-block__overlay\" [ngStyle]=\"overlayStyles()\" aria-hidden=\"true\"></span>\n          <div class=\"basic-block__cover-content\">\n            @for (child of coverContentChildren(); track (child.id + '-' + $index)) {\n              <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n            }\n          </div>\n        } @else {\n          @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n            <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n          }\n        }\n      </div>\n    }\n  }\n\n  @case ('text') {\n    @switch (block().element) {\n      @case ('h1') {\n        <h1 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h1>\n      }\n      @case ('h2') {\n        <h2 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h2>\n      }\n      @case ('h3') {\n        <h3 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h3>\n      }\n      @case ('h4') {\n        <h4 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h4>\n      }\n      @case ('h5') {\n        <h5 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h5>\n      }\n      @case ('h6') {\n        <h6 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h6>\n      }\n      @default {\n        <p [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></p>\n      }\n    }\n  }\n\n  @case ('image') {\n    <img\n      [ngClass]=\"classes()\"\n      [ngStyle]=\"styles()\"\n      [attr.id]=\"data().attributes?.['id'] ?? null\"\n      [src]=\"data().src\"\n      [attr.srcset]=\"data().srcSet ?? null\"\n      [attr.loading]=\"data().loading ?? 'lazy'\"\n      [attr.alt]=\"data().alt ?? ''\"\n      [attr.width]=\"data().attributes?.['width'] ?? null\"\n      [attr.height]=\"data().attributes?.['height'] ?? null\"\n    />\n  }\n\n  @case ('link') {\n    @if (!data().href) {\n      <button [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" type=\"button\">\n        {{ data().text }}\n      </button>\n    } @else {\n      <a\n        [ngClass]=\"classes()\"\n        [ngStyle]=\"styles()\"\n        [attr.id]=\"data().attributes?.['id'] ?? null\"\n        [href]=\"data().href\"\n        [attr.target]=\"data().target ?? null\"\n        [attr.rel]=\"data().rel ?? null\"\n      >\n        {{ data().text }}\n      </a>\n    }\n  }\n\n  @case ('details') {\n    <details [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [attr.open]=\"data().open ? '' : null\">\n      <summary class=\"basic-block__summary\">{{ data().summary }}</summary>\n\n      @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n        <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n      }\n    </details>\n  }\n\n  @case ('spacer') {\n    <div [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" aria-hidden=\"true\"></div>\n  }\n\n  @case ('separator') {\n    <hr [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" />\n  }\n}\n\n\n", styles: [".basic-block{box-sizing:border-box;overflow-wrap:break-word;word-break:break-word}:host{display:contents}.alignfull{margin-left:calc(var(--wp--style--root--padding-left, var(--wp--preset--spacing--50)) * -1);margin-right:calc(var(--wp--style--root--padding-right, var(--wp--preset--spacing--50)) * -1);max-width:none!important;width:auto!important}.alignwide{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--wide-size, 1340px);width:100%}.basic-block--layout-group,.basic-block--layout-columns,.basic-block--layout-grid{width:100%}.basic-block--layout-group.alignnone,.basic-block--layout-columns.alignnone,.basic-block--layout-grid.alignnone{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--content-size, 645px)}.basic-block--layout-column>.alignnone,.basic-block--layout-column>.alignwide{max-width:100%}.basic-block--layout-grid{display:grid;width:100%}.basic-block--layout-columns{box-sizing:border-box;display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--50);margin-bottom:0;width:100%}@media(min-width:782px){.basic-block--layout-columns{flex-wrap:nowrap}}.basic-block--layout-columns.is-not-stacked-on-mobile{flex-wrap:nowrap}.basic-block--layout-column{box-sizing:border-box;flex-basis:100%;flex-grow:1;min-width:0}@media(min-width:782px){.basic-block--layout-column{flex-basis:0}}.is-not-stacked-on-mobile>.basic-block--layout-column,.is-not-stacked-on-mobile>*>.basic-block--layout-column{flex-basis:0}.basic-block--layout-column[style*=flex-basis],.basic-block--layout-column.has-responsive-width{flex-grow:0}.basic-block--layout-column .basic-block--layout-columns,.basic-block--layout-column .basic-block--layout-group{max-width:100%}.basic-block--layout-cover{align-items:center;display:grid;justify-content:center;min-height:unset;overflow:hidden;padding:1em;position:relative}.basic-block__cover-background{inset:0;overflow:hidden;position:absolute;z-index:0}.basic-block__cover-content{position:relative;width:100%;z-index:2}.basic-block--image{display:block;height:auto;max-width:100%;object-fit:cover}.basic-block--layout-cover>.basic-block--image{grid-area:1/1;height:100%;width:100%}.basic-block__overlay{inset:0;pointer-events:none;position:absolute;z-index:1}.basic-block--text{box-sizing:border-box;margin-block:0 1rem}.basic-block--text[style*=border],.basic-block--text[style*=background],.basic-block--text[style*=padding]{display:inline-block;max-width:100%}.has-roboto-font-family{font-family:var(--wp--preset--font-family--roboto, Roboto, sans-serif)!important}.has-manrope-font-family{font-family:var(--wp--preset--font-family--manrope, Manrope, sans-serif)!important}h1.basic-block--text,h2.basic-block--text,h3.basic-block--text,h4.basic-block--text,h5.basic-block--text,h6.basic-block--text{font-weight:400;line-height:1.125;margin-block:0 1.2rem}.has-xx-large-font-size{font-size:var(--wp--preset--font-size--xx-large)!important}.has-medium-font-size{font-size:var(--wp--preset--font-size--medium)!important}.has-large-font-size{font-size:var(--wp--preset--font-size--large)!important}.has-x-large-font-size{font-size:var(--wp--preset--font-size--x-large)!important}.has-small-font-size{font-size:var(--wp--preset--font-size--small)!important}.basic-block--link{align-items:center;background:var(--wp--preset--color--contrast);color:var(--wp--preset--color--base);display:inline-flex;font-size:var(--wp--preset--font-size--medium);min-height:44px;padding:1rem 2.25rem;text-decoration:none}.basic-block--layout-buttons{align-items:center;display:flex;flex-wrap:wrap;gap:1rem}.basic-block--layout-button{border:0;border-radius:9999px;cursor:pointer;justify-content:center;min-width:44px;transition:filter .12s ease}.basic-block--layout-button:hover{filter:brightness(.92)}.basic-block--layout-button:focus-visible{outline:3px solid currentColor;outline-offset:3px}.basic-block--spacer{display:block}.basic-block--separator{display:block;width:100%}.basic-block--details{display:block}.basic-block--layout-quote{border-left:2px solid currentColor;margin:1rem 0;padding:1rem 2rem}.basic-block__summary{cursor:pointer}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: GridComponent, selector: "headless-grid", inputs: ["block"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: BasicBlockComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-basic-block', imports: [NgClass, NgComponentOutlet, NgStyle, GridComponent], template: "@switch (block().type) {\n  @case ('container') {\n    @if (data().layout === 'grid') {\n      <headless-grid [block]=\"block()\" />\n    } @else if (block().element === 'section') {\n      <section [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </section>\n    } @else if (block().element === 'ul') {\n      <ul [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </ul>\n    } @else if (block().element === 'li') {\n      <li [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @if (data().html ?? data().text) {\n          <span [innerHTML]=\"data().html ?? data().text ?? ''\"></span>\n        }\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </li>\n    } @else if (block().element === 'blockquote') {\n      <blockquote [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n          <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n        }\n      </blockquote>\n    } @else if (block().element === 'div' && data().layout === 'html') {\n      <div [ngClass]=\"classes()\" [ngStyle]=\"styles()\">\n        @if (data().attributes?.['id']; as fragmentId) {\n          <a class=\"basic-block__fragment-anchor\" [attr.id]=\"fragmentId\" aria-hidden=\"true\"></a>\n        }\n        <span [innerHTML]=\"data().html ?? ''\"></span>\n      </div>\n    } @else {\n      <div [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\">\n        @if (data().layout === 'cover') {\n          @if (coverBackgroundChild(); as backgroundChild) {\n            <div class=\"basic-block__cover-background\">\n              <ng-container *ngComponentOutlet=\"childComponent(backgroundChild); inputs: { block: backgroundChild }\" />\n            </div>\n          }\n          <span class=\"basic-block__overlay\" [ngStyle]=\"overlayStyles()\" aria-hidden=\"true\"></span>\n          <div class=\"basic-block__cover-content\">\n            @for (child of coverContentChildren(); track (child.id + '-' + $index)) {\n              <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n            }\n          </div>\n        } @else {\n          @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n            <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n          }\n        }\n      </div>\n    }\n  }\n\n  @case ('text') {\n    @switch (block().element) {\n      @case ('h1') {\n        <h1 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h1>\n      }\n      @case ('h2') {\n        <h2 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h2>\n      }\n      @case ('h3') {\n        <h3 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h3>\n      }\n      @case ('h4') {\n        <h4 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h4>\n      }\n      @case ('h5') {\n        <h5 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h5>\n      }\n      @case ('h6') {\n        <h6 [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></h6>\n      }\n      @default {\n        <p [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [innerHTML]=\"data().html ?? data().text ?? ''\"></p>\n      }\n    }\n  }\n\n  @case ('image') {\n    <img\n      [ngClass]=\"classes()\"\n      [ngStyle]=\"styles()\"\n      [attr.id]=\"data().attributes?.['id'] ?? null\"\n      [src]=\"data().src\"\n      [attr.srcset]=\"data().srcSet ?? null\"\n      [attr.loading]=\"data().loading ?? 'lazy'\"\n      [attr.alt]=\"data().alt ?? ''\"\n      [attr.width]=\"data().attributes?.['width'] ?? null\"\n      [attr.height]=\"data().attributes?.['height'] ?? null\"\n    />\n  }\n\n  @case ('link') {\n    @if (!data().href) {\n      <button [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" type=\"button\">\n        {{ data().text }}\n      </button>\n    } @else {\n      <a\n        [ngClass]=\"classes()\"\n        [ngStyle]=\"styles()\"\n        [attr.id]=\"data().attributes?.['id'] ?? null\"\n        [href]=\"data().href\"\n        [attr.target]=\"data().target ?? null\"\n        [attr.rel]=\"data().rel ?? null\"\n      >\n        {{ data().text }}\n      </a>\n    }\n  }\n\n  @case ('details') {\n    <details [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" [attr.open]=\"data().open ? '' : null\">\n      <summary class=\"basic-block__summary\">{{ data().summary }}</summary>\n\n      @for (child of block().children ?? []; track (child.id + '-' + $index)) {\n        <ng-container *ngComponentOutlet=\"childComponent(child); inputs: { block: child }\" />\n      }\n    </details>\n  }\n\n  @case ('spacer') {\n    <div [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" aria-hidden=\"true\"></div>\n  }\n\n  @case ('separator') {\n    <hr [ngClass]=\"classes()\" [ngStyle]=\"styles()\" [attr.id]=\"data().attributes?.['id'] ?? null\" />\n  }\n}\n\n\n", styles: [".basic-block{box-sizing:border-box;overflow-wrap:break-word;word-break:break-word}:host{display:contents}.alignfull{margin-left:calc(var(--wp--style--root--padding-left, var(--wp--preset--spacing--50)) * -1);margin-right:calc(var(--wp--style--root--padding-right, var(--wp--preset--spacing--50)) * -1);max-width:none!important;width:auto!important}.alignwide{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--wide-size, 1340px);width:100%}.basic-block--layout-group,.basic-block--layout-columns,.basic-block--layout-grid{width:100%}.basic-block--layout-group.alignnone,.basic-block--layout-columns.alignnone,.basic-block--layout-grid.alignnone{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--content-size, 645px)}.basic-block--layout-column>.alignnone,.basic-block--layout-column>.alignwide{max-width:100%}.basic-block--layout-grid{display:grid;width:100%}.basic-block--layout-columns{box-sizing:border-box;display:flex;flex-wrap:wrap;gap:var(--wp--preset--spacing--50);margin-bottom:0;width:100%}@media(min-width:782px){.basic-block--layout-columns{flex-wrap:nowrap}}.basic-block--layout-columns.is-not-stacked-on-mobile{flex-wrap:nowrap}.basic-block--layout-column{box-sizing:border-box;flex-basis:100%;flex-grow:1;min-width:0}@media(min-width:782px){.basic-block--layout-column{flex-basis:0}}.is-not-stacked-on-mobile>.basic-block--layout-column,.is-not-stacked-on-mobile>*>.basic-block--layout-column{flex-basis:0}.basic-block--layout-column[style*=flex-basis],.basic-block--layout-column.has-responsive-width{flex-grow:0}.basic-block--layout-column .basic-block--layout-columns,.basic-block--layout-column .basic-block--layout-group{max-width:100%}.basic-block--layout-cover{align-items:center;display:grid;justify-content:center;min-height:unset;overflow:hidden;padding:1em;position:relative}.basic-block__cover-background{inset:0;overflow:hidden;position:absolute;z-index:0}.basic-block__cover-content{position:relative;width:100%;z-index:2}.basic-block--image{display:block;height:auto;max-width:100%;object-fit:cover}.basic-block--layout-cover>.basic-block--image{grid-area:1/1;height:100%;width:100%}.basic-block__overlay{inset:0;pointer-events:none;position:absolute;z-index:1}.basic-block--text{box-sizing:border-box;margin-block:0 1rem}.basic-block--text[style*=border],.basic-block--text[style*=background],.basic-block--text[style*=padding]{display:inline-block;max-width:100%}.has-roboto-font-family{font-family:var(--wp--preset--font-family--roboto, Roboto, sans-serif)!important}.has-manrope-font-family{font-family:var(--wp--preset--font-family--manrope, Manrope, sans-serif)!important}h1.basic-block--text,h2.basic-block--text,h3.basic-block--text,h4.basic-block--text,h5.basic-block--text,h6.basic-block--text{font-weight:400;line-height:1.125;margin-block:0 1.2rem}.has-xx-large-font-size{font-size:var(--wp--preset--font-size--xx-large)!important}.has-medium-font-size{font-size:var(--wp--preset--font-size--medium)!important}.has-large-font-size{font-size:var(--wp--preset--font-size--large)!important}.has-x-large-font-size{font-size:var(--wp--preset--font-size--x-large)!important}.has-small-font-size{font-size:var(--wp--preset--font-size--small)!important}.basic-block--link{align-items:center;background:var(--wp--preset--color--contrast);color:var(--wp--preset--color--base);display:inline-flex;font-size:var(--wp--preset--font-size--medium);min-height:44px;padding:1rem 2.25rem;text-decoration:none}.basic-block--layout-buttons{align-items:center;display:flex;flex-wrap:wrap;gap:1rem}.basic-block--layout-button{border:0;border-radius:9999px;cursor:pointer;justify-content:center;min-width:44px;transition:filter .12s ease}.basic-block--layout-button:hover{filter:brightness(.92)}.basic-block--layout-button:focus-visible{outline:3px solid currentColor;outline-offset:3px}.basic-block--spacer{display:block}.basic-block--separator{display:block;width:100%}.basic-block--details{display:block}.basic-block--layout-quote{border-left:2px solid currentColor;margin:1rem 0;padding:1rem 2rem}.basic-block__summary{cursor:pointer}\n"] }]
        }], ctorParameters: () => [], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

class NavigationRendererComponent {
    document = inject(DOCUMENT);
    items = input.required(...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    ariaLabel = input('Primary navigation', ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
    interceptInternalLinks = input(false, ...(ngDevMode ? [{ debugName: "interceptInternalLinks" }] : /* istanbul ignore next */ []));
    linkSelected = output();
    mobileMenuOpen = signal(false, ...(ngDevMode ? [{ debugName: "mobileMenuOpen" }] : /* istanbul ignore next */ []));
    mobileExpandedItems = signal(new Set(), ...(ngDevMode ? [{ debugName: "mobileExpandedItems" }] : /* istanbul ignore next */ []));
    toggleMobileMenu() {
        this.mobileMenuOpen.update((open) => !open);
    }
    closeMobileMenu() {
        this.mobileMenuOpen.set(false);
    }
    toggleMobileItem(itemId) {
        this.mobileExpandedItems.update((expanded) => {
            const next = new Set(expanded);
            if (next.has(itemId)) {
                next.delete(itemId);
            }
            else {
                next.add(itemId);
            }
            return next;
        });
    }
    isMobileItemExpanded(itemId) {
        return this.mobileExpandedItems().has(itemId);
    }
    href(link) {
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
    select(event, link) {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: NavigationRendererComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: NavigationRendererComponent, isStandalone: true, selector: "headless-navigation-renderer", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: true, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, interceptInternalLinks: { classPropertyName: "interceptInternalLinks", publicName: "interceptInternalLinks", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { linkSelected: "linkSelected" }, ngImport: i0, template: "<nav class=\"navigation\" [attr.aria-label]=\"ariaLabel()\">\n  <button\n    class=\"navigation__toggle\"\n    type=\"button\"\n    [attr.aria-expanded]=\"mobileMenuOpen()\"\n    aria-controls=\"navigation-mobile-menu\"\n    (click)=\"toggleMobileMenu()\"\n  >\n    <mat-icon aria-hidden=\"true\">menu</mat-icon>\n  </button>\n\n  <ul class=\"navigation__list navigation__list--desktop\">\n    <ng-container *ngTemplateOutlet=\"itemsTemplate; context: { items: items() }\" />\n  </ul>\n\n  <div id=\"navigation-mobile-menu\" class=\"navigation__mobile-panel\" [class.navigation__mobile-panel--open]=\"mobileMenuOpen()\">\n    <ul class=\"navigation__list navigation__list--mobile\">\n      <ng-container *ngTemplateOutlet=\"mobileItemsTemplate; context: { items: items() }\" />\n    </ul>\n  </div>\n</nav>\n\n<ng-template #itemsTemplate let-items=\"items\">\n  @for (item of items; track item.id) {\n    <li class=\"navigation__item\">\n      @if (item.children?.length) {\n        <button mat-button class=\"navigation__link\" type=\"button\" [matMenuTriggerFor]=\"childMenu\">\n          {{ item.label }} <mat-icon aria-hidden=\"true\">expand_more</mat-icon>\n        </button>\n        <mat-menu #childMenu=\"matMenu\">\n          @for (child of item.children; track child.id) {\n            <a mat-menu-item [href]=\"href(child.link)\" [attr.target]=\"child.link.type === 'external' ? child.link.target ?? null : null\" [attr.rel]=\"child.link.type === 'external' ? child.link.rel?.join(' ') ?? null : null\" (click)=\"select($event, child.link)\">\n              {{ child.label }}\n            </a>\n          }\n        </mat-menu>\n      } @else {\n        <a\n          mat-button\n          class=\"navigation__link\"\n          [href]=\"href(item.link)\"\n          [attr.target]=\"item.link.type === 'external' ? item.link.target ?? null : null\"\n          [attr.rel]=\"item.link.type === 'external' ? item.link.rel?.join(' ') ?? null : null\"\n          (click)=\"select($event, item.link)\"\n        >\n          {{ item.label }}\n        </a>\n      }\n    </li>\n  }\n</ng-template>\n\n<ng-template #mobileItemsTemplate let-items=\"items\">\n  @for (item of items; track item.id) {\n    <li class=\"navigation__item\">\n      <div class=\"navigation__mobile-row\">\n        <a\n          class=\"navigation__link\"\n          [href]=\"href(item.link)\"\n          [attr.target]=\"item.link.type === 'external' ? item.link.target ?? null : null\"\n          [attr.rel]=\"item.link.type === 'external' ? item.link.rel?.join(' ') ?? null : null\"\n          (click)=\"select($event, item.link)\"\n        >\n          {{ item.label }}\n        </a>\n        @if (item.children?.length) {\n          <button\n            class=\"navigation__submenu-toggle\"\n            type=\"button\"\n            [attr.aria-expanded]=\"isMobileItemExpanded(item.id)\"\n            [attr.aria-controls]=\"'navigation-submenu-' + item.id\"\n            (click)=\"toggleMobileItem(item.id)\"\n          >\n            <mat-icon aria-hidden=\"true\">expand_more</mat-icon>\n            <span class=\"visually-hidden\">Toggle {{ item.label }} submenu</span>\n          </button>\n        }\n      </div>\n      @if (item.children?.length && isMobileItemExpanded(item.id)) {\n        <ul class=\"navigation__children\" [id]=\"'navigation-submenu-' + item.id\">\n          <ng-container *ngTemplateOutlet=\"mobileItemsTemplate; context: { items: item.children }\" />\n        </ul>\n      }\n    </li>\n  }\n</ng-template>\n\n\n", styles: [":host{display:block;width:var(--wp--preset--navigation--width, 100%);color:var(--wp--preset--navigation--color, var(--wp--preset--color--contrast, currentColor));font-family:var(--wp--preset--navigation--font-family, var(--wp--preset--font-family--roboto, inherit));font-size:var(--wp--preset--navigation--font-size, var(--wp--preset--font-size--medium, 1rem));font-weight:var(--wp--preset--navigation--font-weight, 500);line-height:var(--wp--preset--navigation--line-height, 1.4)}.navigation__list,.navigation__children{display:flex;gap:var(--wp--preset--navigation--gap, var(--wp--preset--spacing--40, 1.25rem));list-style:none;margin:var(--wp--preset--navigation--list-margin, 0);padding:var(--wp--preset--navigation--list-padding, 0)}.navigation__children{margin-top:var(--wp--preset--navigation--submenu-margin-top, var(--wp--preset--spacing--30, .75rem));padding-left:var(--wp--preset--navigation--submenu-padding-left, var(--wp--preset--spacing--40, 1rem));flex-direction:column}.navigation__item{position:relative}.navigation__link{align-items:center;color:inherit;display:inline-flex;min-height:var(--wp--preset--navigation--link-min-height, 44px);padding:var(--wp--preset--navigation--link-padding, .5rem .75rem);width:var(--wp--preset--navigation--link-width, auto);text-decoration:none}.navigation__link mat-icon{font-size:var(--wp--preset--navigation--icon-size, 1.1rem);height:var(--wp--preset--navigation--icon-size, 1.1rem);margin-left:var(--wp--preset--navigation--icon-gap, .25rem);width:var(--wp--preset--navigation--icon-size, 1.1rem)}.navigation__link:hover,.navigation__link:focus-visible{text-decoration:underline;text-underline-offset:.2em}.navigation__toggle,.navigation__mobile-panel{display:none}.navigation__toggle{align-items:center;background:var(--wp--preset--navigation--toggle-background, transparent);border:var(--wp--preset--navigation--toggle-border, 0);color:inherit;cursor:pointer;font:inherit;gap:var(--wp--preset--navigation--toggle-gap, var(--wp--preset--spacing--20, .5rem));min-height:var(--wp--preset--navigation--toggle-min-height, 44px);padding:var(--wp--preset--navigation--toggle-padding, .5rem .75rem)}.navigation__mobile-row{align-items:center;display:flex;justify-content:space-between}.navigation__submenu-toggle{background:transparent;border:0;color:inherit;cursor:pointer;min-height:var(--wp--preset--navigation--link-min-height, 44px);min-width:var(--wp--preset--navigation--link-min-height, 44px)}.navigation__submenu-toggle mat-icon{transition:transform .16s ease}.navigation__submenu-toggle[aria-expanded=true] mat-icon{transform:rotate(180deg)}.visually-hidden{clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}@media(max-width:799.98px){.navigation__list--desktop{display:none}.navigation__toggle{display:inline-flex}.navigation__mobile-panel{background:var(--wp--preset--navigation--mobile-background, var(--wp--preset--color--base, #fff));border:var(--wp--preset--navigation--mobile-border, 1px solid transparent);padding:var(--wp--preset--navigation--mobile-padding, var(--wp--preset--spacing--30, .75rem))}.navigation__mobile-panel--open{display:block}.navigation__list--mobile{display:flex;flex-direction:column;gap:var(--wp--preset--navigation--mobile-gap, var(--wp--preset--spacing--20, .5rem))}.navigation__list--mobile .navigation__link{flex:1;width:var(--wp--preset--navigation--mobile-link-width, 100%)}}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i1.MatButton, selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ", inputs: ["matButton"], exportAs: ["matButton", "matAnchor"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatMenuModule }, { kind: "component", type: i3$1.MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: i3$1.MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "directive", type: i3$1.MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: NavigationRendererComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-navigation-renderer', imports: [NgTemplateOutlet, MatButtonModule, MatIconModule, MatMenuModule], template: "<nav class=\"navigation\" [attr.aria-label]=\"ariaLabel()\">\n  <button\n    class=\"navigation__toggle\"\n    type=\"button\"\n    [attr.aria-expanded]=\"mobileMenuOpen()\"\n    aria-controls=\"navigation-mobile-menu\"\n    (click)=\"toggleMobileMenu()\"\n  >\n    <mat-icon aria-hidden=\"true\">menu</mat-icon>\n  </button>\n\n  <ul class=\"navigation__list navigation__list--desktop\">\n    <ng-container *ngTemplateOutlet=\"itemsTemplate; context: { items: items() }\" />\n  </ul>\n\n  <div id=\"navigation-mobile-menu\" class=\"navigation__mobile-panel\" [class.navigation__mobile-panel--open]=\"mobileMenuOpen()\">\n    <ul class=\"navigation__list navigation__list--mobile\">\n      <ng-container *ngTemplateOutlet=\"mobileItemsTemplate; context: { items: items() }\" />\n    </ul>\n  </div>\n</nav>\n\n<ng-template #itemsTemplate let-items=\"items\">\n  @for (item of items; track item.id) {\n    <li class=\"navigation__item\">\n      @if (item.children?.length) {\n        <button mat-button class=\"navigation__link\" type=\"button\" [matMenuTriggerFor]=\"childMenu\">\n          {{ item.label }} <mat-icon aria-hidden=\"true\">expand_more</mat-icon>\n        </button>\n        <mat-menu #childMenu=\"matMenu\">\n          @for (child of item.children; track child.id) {\n            <a mat-menu-item [href]=\"href(child.link)\" [attr.target]=\"child.link.type === 'external' ? child.link.target ?? null : null\" [attr.rel]=\"child.link.type === 'external' ? child.link.rel?.join(' ') ?? null : null\" (click)=\"select($event, child.link)\">\n              {{ child.label }}\n            </a>\n          }\n        </mat-menu>\n      } @else {\n        <a\n          mat-button\n          class=\"navigation__link\"\n          [href]=\"href(item.link)\"\n          [attr.target]=\"item.link.type === 'external' ? item.link.target ?? null : null\"\n          [attr.rel]=\"item.link.type === 'external' ? item.link.rel?.join(' ') ?? null : null\"\n          (click)=\"select($event, item.link)\"\n        >\n          {{ item.label }}\n        </a>\n      }\n    </li>\n  }\n</ng-template>\n\n<ng-template #mobileItemsTemplate let-items=\"items\">\n  @for (item of items; track item.id) {\n    <li class=\"navigation__item\">\n      <div class=\"navigation__mobile-row\">\n        <a\n          class=\"navigation__link\"\n          [href]=\"href(item.link)\"\n          [attr.target]=\"item.link.type === 'external' ? item.link.target ?? null : null\"\n          [attr.rel]=\"item.link.type === 'external' ? item.link.rel?.join(' ') ?? null : null\"\n          (click)=\"select($event, item.link)\"\n        >\n          {{ item.label }}\n        </a>\n        @if (item.children?.length) {\n          <button\n            class=\"navigation__submenu-toggle\"\n            type=\"button\"\n            [attr.aria-expanded]=\"isMobileItemExpanded(item.id)\"\n            [attr.aria-controls]=\"'navigation-submenu-' + item.id\"\n            (click)=\"toggleMobileItem(item.id)\"\n          >\n            <mat-icon aria-hidden=\"true\">expand_more</mat-icon>\n            <span class=\"visually-hidden\">Toggle {{ item.label }} submenu</span>\n          </button>\n        }\n      </div>\n      @if (item.children?.length && isMobileItemExpanded(item.id)) {\n        <ul class=\"navigation__children\" [id]=\"'navigation-submenu-' + item.id\">\n          <ng-container *ngTemplateOutlet=\"mobileItemsTemplate; context: { items: item.children }\" />\n        </ul>\n      }\n    </li>\n  }\n</ng-template>\n\n\n", styles: [":host{display:block;width:var(--wp--preset--navigation--width, 100%);color:var(--wp--preset--navigation--color, var(--wp--preset--color--contrast, currentColor));font-family:var(--wp--preset--navigation--font-family, var(--wp--preset--font-family--roboto, inherit));font-size:var(--wp--preset--navigation--font-size, var(--wp--preset--font-size--medium, 1rem));font-weight:var(--wp--preset--navigation--font-weight, 500);line-height:var(--wp--preset--navigation--line-height, 1.4)}.navigation__list,.navigation__children{display:flex;gap:var(--wp--preset--navigation--gap, var(--wp--preset--spacing--40, 1.25rem));list-style:none;margin:var(--wp--preset--navigation--list-margin, 0);padding:var(--wp--preset--navigation--list-padding, 0)}.navigation__children{margin-top:var(--wp--preset--navigation--submenu-margin-top, var(--wp--preset--spacing--30, .75rem));padding-left:var(--wp--preset--navigation--submenu-padding-left, var(--wp--preset--spacing--40, 1rem));flex-direction:column}.navigation__item{position:relative}.navigation__link{align-items:center;color:inherit;display:inline-flex;min-height:var(--wp--preset--navigation--link-min-height, 44px);padding:var(--wp--preset--navigation--link-padding, .5rem .75rem);width:var(--wp--preset--navigation--link-width, auto);text-decoration:none}.navigation__link mat-icon{font-size:var(--wp--preset--navigation--icon-size, 1.1rem);height:var(--wp--preset--navigation--icon-size, 1.1rem);margin-left:var(--wp--preset--navigation--icon-gap, .25rem);width:var(--wp--preset--navigation--icon-size, 1.1rem)}.navigation__link:hover,.navigation__link:focus-visible{text-decoration:underline;text-underline-offset:.2em}.navigation__toggle,.navigation__mobile-panel{display:none}.navigation__toggle{align-items:center;background:var(--wp--preset--navigation--toggle-background, transparent);border:var(--wp--preset--navigation--toggle-border, 0);color:inherit;cursor:pointer;font:inherit;gap:var(--wp--preset--navigation--toggle-gap, var(--wp--preset--spacing--20, .5rem));min-height:var(--wp--preset--navigation--toggle-min-height, 44px);padding:var(--wp--preset--navigation--toggle-padding, .5rem .75rem)}.navigation__mobile-row{align-items:center;display:flex;justify-content:space-between}.navigation__submenu-toggle{background:transparent;border:0;color:inherit;cursor:pointer;min-height:var(--wp--preset--navigation--link-min-height, 44px);min-width:var(--wp--preset--navigation--link-min-height, 44px)}.navigation__submenu-toggle mat-icon{transition:transform .16s ease}.navigation__submenu-toggle[aria-expanded=true] mat-icon{transform:rotate(180deg)}.visually-hidden{clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}@media(max-width:799.98px){.navigation__list--desktop{display:none}.navigation__toggle{display:inline-flex}.navigation__mobile-panel{background:var(--wp--preset--navigation--mobile-background, var(--wp--preset--color--base, #fff));border:var(--wp--preset--navigation--mobile-border, 1px solid transparent);padding:var(--wp--preset--navigation--mobile-padding, var(--wp--preset--spacing--30, .75rem))}.navigation__mobile-panel--open{display:block}.navigation__list--mobile{display:flex;flex-direction:column;gap:var(--wp--preset--navigation--mobile-gap, var(--wp--preset--spacing--20, .5rem))}.navigation__list--mobile .navigation__link{flex:1;width:var(--wp--preset--navigation--mobile-link-width, 100%)}}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: true }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], interceptInternalLinks: [{ type: i0.Input, args: [{ isSignal: true, alias: "interceptInternalLinks", required: false }] }], linkSelected: [{ type: i0.Output, args: ["linkSelected"] }] } });

class HeadlessBlockOutletComponent {
    block = input.required(...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    registry = inject(BlockComponentRegistry);
    component = computed(() => this.registry.resolve(this.block()), ...(ngDevMode ? [{ debugName: "component" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: HeadlessBlockOutletComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.2.23", type: HeadlessBlockOutletComponent, isStandalone: true, selector: "headless-block-outlet", inputs: { block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: '<ng-container *ngComponentOutlet="component(); inputs: { block: block() }" />', isInline: true, dependencies: [{ kind: "directive", type: NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: ["ngComponentOutlet", "ngComponentOutletInputs", "ngComponentOutletInjector", "ngComponentOutletEnvironmentInjector", "ngComponentOutletContent", "ngComponentOutletNgModule"], exportAs: ["ngComponentOutlet"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: HeadlessBlockOutletComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'headless-block-outlet',
                    imports: [NgComponentOutlet],
                    template: '<ng-container *ngComponentOutlet="component(); inputs: { block: block() }" />',
                }]
        }], propDecorators: { block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: true }] }] } });

class HeadlessPageRendererComponent {
    schema = input.required(...(ngDevMode ? [{ debugName: "schema" }] : /* istanbul ignore next */ []));
    config = inject(HEADLESS_ANGULAR_CONFIG);
    shouldRenderPageTitle = computed(() => this.config.renderPageTitle !== false, ...(ngDevMode ? [{ debugName: "shouldRenderPageTitle" }] : /* istanbul ignore next */ []));
    alignmentClasses(block) {
        return {
            alignnone: block.align === 'none',
            alignwide: block.align === 'wide',
            alignfull: block.align === 'full',
        };
    }
    resolvedBlocks = computed(() => this.schema().page.blocks, ...(ngDevMode ? [{ debugName: "resolvedBlocks" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: HeadlessPageRendererComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: HeadlessPageRendererComponent, isStandalone: true, selector: "headless-page-renderer", inputs: { schema: { classPropertyName: "schema", publicName: "schema", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: "<main class=\"headless-page\" [attr.data-locale]=\"schema().locale\">\n  @if (shouldRenderPageTitle()) {\n    <h1 class=\"headless-page__title\">{{ schema().page.title }}</h1>\n  }\n\n  @for (block of resolvedBlocks(); track (block.id + '-' + $index)) {\n    <div class=\"headless-page__block\" [ngClass]=\"alignmentClasses(block)\">\n      <headless-block-outlet [block]=\"block\" />\n    </div>\n  }\n</main>\n", styles: [".headless-page{--wp--preset--color--base: #ffffff;--wp--preset--color--contrast: #111111;--wp--preset--color--accent-1: #ffee58;--wp--preset--color--accent-2: #f6cff4;--wp--preset--color--accent-3: #503aa8;--wp--preset--color--accent-4: #686868;--wp--preset--color--accent-5: #fbfaf3;--wp--preset--color--accent-6: color-mix(in srgb, currentColor 20%, transparent);--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, .2);--wp--preset--font-family--manrope: Manrope, sans-serif;--wp--preset--font-family--roboto: Roboto, sans-serif;--wp--preset--font-size--x-small: .735rem;--wp--preset--font-size--small: .875rem;--wp--preset--font-size--medium: clamp(1rem, 1rem + ((1vw - .2rem) * .196), 1.125rem);--wp--preset--font-size--large: clamp(1.125rem, 1.125rem + ((1vw - .2rem) * .392), 1.575rem);--wp--preset--font-size--x-large: clamp(1.75rem, 1.75rem + ((1vw - .2rem) * .392), 2rem);--wp--preset--font-size--xx-large: clamp(2.15rem, 2.15rem + ((1vw - .2rem) * 1.333), 3rem);--wp--preset--timeline-color--contrast: var(--wp--preset--color--contrast);--wp--preset--timeline-color--accent-1: var(--wp--preset--color--accent-1);--wp--preset--timeline-color--accent-4: var(--wp--preset--color--accent-4);--wp--preset--timeline-color--accent-6: var(--wp--preset--color--accent-6);--wp--preset--timeline-color--base: var(--wp--preset--color--base);--wp--preset--timeline-font-size--small: var(--wp--preset--font-size--small);--wp--preset--timeline-font-size--medium: var(--wp--preset--font-size--medium);--wp--preset--timeline-font-size--xx-large: var(--wp--preset--font-size--xx-large);--wp--preset--timeline-font-size--x-small: var(--wp--preset--font-size--x-small);--wp--preset--spacing--5: 3px;--wp--preset--spacing--10: 5px;--wp--preset--spacing--20: 10px;--wp--preset--spacing--30: 20px;--wp--preset--spacing--40: 30px;--wp--preset--spacing--50: clamp(30px, 5vw, 50px);--wp--preset--spacing--60: clamp(30px, 7vw, 70px);--wp--preset--spacing--70: clamp(50px, 7vw, 90px);--wp--preset--spacing--80: clamp(70px, 10vw, 140px);--wp--preset--featured-cards--title-font-size: var(--wp--preset--font-size--large);--wp--preset--featured-cards--content-font-size: clamp(.875rem, .875rem + ((1vw - .2rem) * .196), 1rem);--wp--preset--featured-cards--tag-font-size: var(--wp--preset--font-size--x-small);--wp--preset--featured-cards--card-padding: 0 clamp(15px, 3vw, 25px) clamp(15px, 3vw, 25px);--wp--preset--featured-cards--tag-padding: .4rem .8rem;--wp--preset--featured-cards--tag-gap: var(--wp--preset--spacing--5);background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);display:block;font-family:var(--wp--preset--font-family--manrope);font-size:var(--wp--preset--font-size--large);font-weight:300;line-height:1.4;margin-top:var(--wp--preset--spacing--60);padding-left:var(--wp--style--root--padding-left, var(--wp--preset--spacing--50));padding-right:var(--wp--style--root--padding-right, var(--wp--preset--spacing--50))}.headless-page__title{box-sizing:border-box;font-size:var(--wp--preset--font-size--xx-large);font-weight:400;line-height:1.125;margin:0;padding:var(--wp--preset--spacing--60) 0 0;word-break:break-word}.headless-page__block{box-sizing:border-box;width:100%}.headless-page__block.alignnone{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--content-size, 645px)}.headless-page__block.alignwide{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--wide-size, 1340px)}.headless-page__block.alignfull{margin-left:calc(var(--wp--style--root--padding-left, var(--wp--preset--spacing--50)) * -1);margin-right:calc(var(--wp--style--root--padding-right, var(--wp--preset--spacing--50)) * -1);max-width:none;width:auto}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: HeadlessBlockOutletComponent, selector: "headless-block-outlet", inputs: ["block"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: HeadlessPageRendererComponent, decorators: [{
            type: Component,
            args: [{ selector: 'headless-page-renderer', imports: [NgClass, HeadlessBlockOutletComponent], template: "<main class=\"headless-page\" [attr.data-locale]=\"schema().locale\">\n  @if (shouldRenderPageTitle()) {\n    <h1 class=\"headless-page__title\">{{ schema().page.title }}</h1>\n  }\n\n  @for (block of resolvedBlocks(); track (block.id + '-' + $index)) {\n    <div class=\"headless-page__block\" [ngClass]=\"alignmentClasses(block)\">\n      <headless-block-outlet [block]=\"block\" />\n    </div>\n  }\n</main>\n", styles: [".headless-page{--wp--preset--color--base: #ffffff;--wp--preset--color--contrast: #111111;--wp--preset--color--accent-1: #ffee58;--wp--preset--color--accent-2: #f6cff4;--wp--preset--color--accent-3: #503aa8;--wp--preset--color--accent-4: #686868;--wp--preset--color--accent-5: #fbfaf3;--wp--preset--color--accent-6: color-mix(in srgb, currentColor 20%, transparent);--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, .2);--wp--preset--font-family--manrope: Manrope, sans-serif;--wp--preset--font-family--roboto: Roboto, sans-serif;--wp--preset--font-size--x-small: .735rem;--wp--preset--font-size--small: .875rem;--wp--preset--font-size--medium: clamp(1rem, 1rem + ((1vw - .2rem) * .196), 1.125rem);--wp--preset--font-size--large: clamp(1.125rem, 1.125rem + ((1vw - .2rem) * .392), 1.575rem);--wp--preset--font-size--x-large: clamp(1.75rem, 1.75rem + ((1vw - .2rem) * .392), 2rem);--wp--preset--font-size--xx-large: clamp(2.15rem, 2.15rem + ((1vw - .2rem) * 1.333), 3rem);--wp--preset--timeline-color--contrast: var(--wp--preset--color--contrast);--wp--preset--timeline-color--accent-1: var(--wp--preset--color--accent-1);--wp--preset--timeline-color--accent-4: var(--wp--preset--color--accent-4);--wp--preset--timeline-color--accent-6: var(--wp--preset--color--accent-6);--wp--preset--timeline-color--base: var(--wp--preset--color--base);--wp--preset--timeline-font-size--small: var(--wp--preset--font-size--small);--wp--preset--timeline-font-size--medium: var(--wp--preset--font-size--medium);--wp--preset--timeline-font-size--xx-large: var(--wp--preset--font-size--xx-large);--wp--preset--timeline-font-size--x-small: var(--wp--preset--font-size--x-small);--wp--preset--spacing--5: 3px;--wp--preset--spacing--10: 5px;--wp--preset--spacing--20: 10px;--wp--preset--spacing--30: 20px;--wp--preset--spacing--40: 30px;--wp--preset--spacing--50: clamp(30px, 5vw, 50px);--wp--preset--spacing--60: clamp(30px, 7vw, 70px);--wp--preset--spacing--70: clamp(50px, 7vw, 90px);--wp--preset--spacing--80: clamp(70px, 10vw, 140px);--wp--preset--featured-cards--title-font-size: var(--wp--preset--font-size--large);--wp--preset--featured-cards--content-font-size: clamp(.875rem, .875rem + ((1vw - .2rem) * .196), 1rem);--wp--preset--featured-cards--tag-font-size: var(--wp--preset--font-size--x-small);--wp--preset--featured-cards--card-padding: 0 clamp(15px, 3vw, 25px) clamp(15px, 3vw, 25px);--wp--preset--featured-cards--tag-padding: .4rem .8rem;--wp--preset--featured-cards--tag-gap: var(--wp--preset--spacing--5);background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);display:block;font-family:var(--wp--preset--font-family--manrope);font-size:var(--wp--preset--font-size--large);font-weight:300;line-height:1.4;margin-top:var(--wp--preset--spacing--60);padding-left:var(--wp--style--root--padding-left, var(--wp--preset--spacing--50));padding-right:var(--wp--style--root--padding-right, var(--wp--preset--spacing--50))}.headless-page__title{box-sizing:border-box;font-size:var(--wp--preset--font-size--xx-large);font-weight:400;line-height:1.125;margin:0;padding:var(--wp--preset--spacing--60) 0 0;word-break:break-word}.headless-page__block{box-sizing:border-box;width:100%}.headless-page__block.alignnone{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--content-size, 645px)}.headless-page__block.alignwide{margin-left:auto;margin-right:auto;max-width:var(--wp--style--global--wide-size, 1340px)}.headless-page__block.alignfull{margin-left:calc(var(--wp--style--root--padding-left, var(--wp--preset--spacing--50)) * -1);margin-right:calc(var(--wp--style--root--padding-right, var(--wp--preset--spacing--50)) * -1);max-width:none;width:auto}\n"] }]
        }], propDecorators: { schema: [{ type: i0.Input, args: [{ isSignal: true, alias: "schema", required: true }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { BasicBlockComponent, BlockComponentRegistry, DEFAULT_ANGULAR_BLOCKS, FeaturedCardsComponent, FormComponent, HEADLESS_ANGULAR_CONFIG, HEADLESS_CONTENT_CLIENT, HeadlessBlockOutletComponent, HeadlessPageRendererComponent, HeroComponent, InteractiveBlockComponent, NavigationRendererComponent, SafeStyleService, TimelineComponent, UnsupportedBlockComponent, provideHeadlessAngular };
//# sourceMappingURL=jmgduarte-headless-angular.mjs.map
