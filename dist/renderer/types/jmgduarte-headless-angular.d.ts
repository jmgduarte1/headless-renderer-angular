import * as _jmgduarte_headless_angular from '@jmgduarte/headless-angular';
import * as _jmgduarte_headless_core from '@jmgduarte/headless-core';
import { BasicBlock, PageBlock, HeroBlock, HeroAction, FeaturedCardsBlock, TimelineBlock, TimelinePeriod, SchemaInteractiveBlock, FormBlock, FormFieldSchema, NavigationItem, LinkModel, PageSchema, UnsupportedBlockStrategy, ContentClient, BlockStyle } from '@jmgduarte/headless-core';
import * as _angular_core from '@angular/core';
import { Type, InjectionToken, EnvironmentProviders } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

declare class BasicBlockComponent {
    readonly block: _angular_core.InputSignal<BasicBlock>;
    private readonly styleService;
    private readonly resourceHints;
    private readonly registry;
    private readonly injector;
    constructor();
    readonly data: _angular_core.Signal<_jmgduarte_headless_core.BasicBlockData>;
    readonly isPriorityImage: _angular_core.Signal<boolean>;
    readonly imageLoading: _angular_core.Signal<"eager" | "lazy">;
    readonly imageFetchPriority: _angular_core.Signal<"high" | "auto">;
    childComponent(child: PageBlock): _jmgduarte_headless_angular.BlockComponent;
    readonly responsiveClass: _angular_core.Signal<string>;
    readonly classes: _angular_core.Signal<{
        [x: string]: boolean;
        'basic-block': boolean;
        'is-not-stacked-on-mobile': boolean;
        'has-responsive-width': boolean;
    }>;
    readonly responsiveStyles: _angular_core.Signal<string>;
    readonly styles: _angular_core.Signal<Record<string, string | number>>;
    readonly overlayStyles: _angular_core.Signal<Record<string, string | number>>;
    coverBackgroundChild(): BasicBlock | undefined;
    coverContentChildren(): BasicBlock[];
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<BasicBlockComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<BasicBlockComponent, "headless-basic-block", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class HeroComponent {
    readonly block: _angular_core.InputSignal<HeroBlock>;
    private readonly styleService;
    private readonly resourceHints;
    private readonly injector;
    constructor();
    readonly data: _angular_core.Signal<_jmgduarte_headless_core.HeroBlockData>;
    readonly responsiveClass: _angular_core.Signal<string>;
    readonly hostStyles: _angular_core.Signal<Record<string, string | number>>;
    readonly contentStyles: _angular_core.Signal<Record<string, string | number>>;
    readonly mediaStyles: _angular_core.Signal<Record<string, string | number>>;
    readonly overlayStyles: _angular_core.Signal<Record<string, string | number>>;
    readonly hostClasses: _angular_core.Signal<{
        [x: string]: boolean;
    }>;
    readonly responsiveStyles: _angular_core.Signal<string>;
    imageAlt(): string;
    relFor(action: HeroAction): string | null;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<HeroComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<HeroComponent, "headless-hero", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class FeaturedCardsComponent {
    readonly block: _angular_core.InputSignal<FeaturedCardsBlock>;
    private readonly styleService;
    private readonly injector;
    readonly data: _angular_core.Signal<_jmgduarte_headless_core.FeaturedCardsData>;
    readonly selectedCategory: _angular_core.WritableSignal<string | null>;
    readonly categories: _angular_core.Signal<string[]>;
    readonly activeCategory: _angular_core.Signal<string | null>;
    readonly visibleCards: _angular_core.Signal<_jmgduarte_headless_core.FeaturedCard[]>;
    readonly responsiveClass: _angular_core.Signal<string>;
    readonly styles: _angular_core.Signal<Record<string, string | number>>;
    readonly responsiveStyles: _angular_core.Signal<string>;
    constructor();
    cardStyles(card: FeaturedCardsBlock['data']['cards'][number]): Record<string, string | number>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<FeaturedCardsComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<FeaturedCardsComponent, "headless-featured-cards", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class TimelineComponent {
    readonly block: _angular_core.InputSignal<TimelineBlock>;
    private readonly styleService;
    private readonly injector;
    readonly data: _angular_core.Signal<_jmgduarte_headless_core.TimelineData>;
    readonly styles: _angular_core.Signal<Record<string, string | number>>;
    readonly linkClass: _angular_core.Signal<string>;
    readonly compactPeriods: _angular_core.Signal<TimelinePeriod[]>;
    readonly compactExpanded: _angular_core.WritableSignal<boolean>;
    readonly compactPeriodState: _angular_core.WritableSignal<Record<string, boolean>>;
    private readonly initializeCompactState;
    periodStyles(period: TimelinePeriod): Record<string, string | number>;
    toggleCompactPeriods(): void;
    isPeriodExpanded(period: TimelinePeriod): boolean;
    onDetailsToggle(period: TimelinePeriod, event: Event): void;
    formatDate(value: string): string;
    periodRange(period: TimelinePeriod): string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TimelineComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<TimelineComponent, "headless-timeline", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class InteractiveBlockComponent {
    readonly block: _angular_core.InputSignal<SchemaInteractiveBlock>;
    private readonly styleService;
    private readonly registry;
    private readonly breakpointObserver;
    private readonly injector;
    readonly data: _angular_core.Signal<_jmgduarte_headless_core.InteractiveBlockData>;
    readonly responsiveClass: _angular_core.Signal<string>;
    readonly styles: _angular_core.Signal<Record<string, string | number>>;
    readonly activeTab: _angular_core.WritableSignal<number>;
    readonly isMobile: _angular_core.WritableSignal<boolean>;
    readonly classes: _angular_core.Signal<{
        alignnone: boolean;
        alignwide: boolean;
        alignfull: boolean;
    }>;
    constructor();
    selectTab(index: number): void;
    openAccordion(index: number): void;
    closeAccordion(index: number): void;
    onTabKeydown(event: KeyboardEvent, index: number): void;
    tabId(index: number): string;
    panelId(index: number): string;
    childComponent(child: PageBlock): _jmgduarte_headless_angular.BlockComponent;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<InteractiveBlockComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<InteractiveBlockComponent, "headless-interactive-block", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class FormComponent {
    readonly block: _angular_core.InputSignal<FormBlock>;
    private readonly formService;
    private readonly styleService;
    readonly submitting: _angular_core.WritableSignal<boolean>;
    readonly errorMessage: _angular_core.WritableSignal<string | null>;
    readonly successMessage: _angular_core.WritableSignal<string | null>;
    readonly data: _angular_core.Signal<_jmgduarte_headless_core.FormBlockData>;
    readonly styles: _angular_core.Signal<Record<string, string | number>>;
    readonly form: _angular_core.Signal<FormGroup<Record<string, FormControl<unknown>>>>;
    control(field: FormFieldSchema): FormControl<unknown>;
    isChecked(field: FormFieldSchema, value: string): boolean;
    toggleCheckbox(field: FormFieldSchema, value: string, checked: boolean): void;
    submit(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<FormComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<FormComponent, "headless-form", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class NavigationRendererComponent {
    private readonly document;
    readonly items: _angular_core.InputSignal<NavigationItem[]>;
    readonly ariaLabel: _angular_core.InputSignal<string>;
    readonly interceptInternalLinks: _angular_core.InputSignal<boolean>;
    readonly linkSelected: _angular_core.OutputEmitterRef<LinkModel>;
    readonly mobileMenuOpen: _angular_core.WritableSignal<boolean>;
    readonly mobileExpandedItems: _angular_core.WritableSignal<ReadonlySet<string>>;
    toggleMobileMenu(): void;
    closeMobileMenu(): void;
    toggleMobileItem(itemId: string): void;
    isMobileItemExpanded(itemId: string): boolean;
    href(link: LinkModel): string;
    select(event: MouseEvent, link: LinkModel): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NavigationRendererComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<NavigationRendererComponent, "headless-navigation-renderer", never, { "items": { "alias": "items"; "required": true; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; "interceptInternalLinks": { "alias": "interceptInternalLinks"; "required": false; "isSignal": true; }; }, { "linkSelected": "linkSelected"; }, never, never, true, never>;
}

declare class UnsupportedBlockComponent {
    readonly block: _angular_core.InputSignal<PageBlock<unknown>>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UnsupportedBlockComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UnsupportedBlockComponent, "headless-unsupported-block", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class HeadlessPageRendererComponent {
    readonly schema: _angular_core.InputSignal<PageSchema>;
    private readonly config;
    readonly shouldRenderPageTitle: _angular_core.Signal<boolean>;
    alignmentClasses(block: PageSchema['page']['blocks'][number]): {
        alignnone: boolean;
        alignwide: boolean;
        alignfull: boolean;
    };
    readonly resolvedBlocks: _angular_core.Signal<_jmgduarte_headless_core.M1Block[]>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<HeadlessPageRendererComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<HeadlessPageRendererComponent, "headless-page-renderer", never, { "schema": { "alias": "schema"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class HeadlessBlockOutletComponent {
    readonly block: _angular_core.InputSignal<PageBlock<unknown>>;
    private readonly registry;
    readonly component: _angular_core.Signal<_jmgduarte_headless_angular.BlockComponent>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<HeadlessBlockOutletComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<HeadlessBlockOutletComponent, "headless-block-outlet", never, { "block": { "alias": "block"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

type BlockComponent = Type<unknown>;
interface AngularBlockRegistration {
    type: string;
    component: BlockComponent;
}
declare const DEFAULT_ANGULAR_BLOCKS: readonly AngularBlockRegistration[];
declare class BlockComponentRegistry {
    private readonly components;
    private readonly fallback;
    private readonly strategy;
    constructor(registrations?: readonly AngularBlockRegistration[], unsupported?: {
        strategy?: UnsupportedBlockStrategy;
        component?: BlockComponent;
    });
    register(type: string, component: BlockComponent): void;
    registerMany(registrations: readonly AngularBlockRegistration[]): void;
    unregister(type: string): boolean;
    has(type: string): boolean;
    resolve(block: PageBlock): BlockComponent;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<BlockComponentRegistry, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<BlockComponentRegistry>;
}

interface HeadlessAngularConfig {
    renderPageTitle?: boolean;
    unsupportedBlocks?: {
        strategy?: UnsupportedBlockStrategy;
        component?: AngularBlockRegistration['component'];
    };
    blocks?: readonly AngularBlockRegistration[];
    contentClient?: ContentClient;
}
declare const HEADLESS_ANGULAR_CONFIG: InjectionToken<Required<Pick<HeadlessAngularConfig, "renderPageTitle">> & HeadlessAngularConfig>;
declare const HEADLESS_CONTENT_CLIENT: InjectionToken<ContentClient>;
type HeadlessAngularFeature = EnvironmentProviders;
declare function provideHeadlessAngular(config?: HeadlessAngularConfig, ...features: HeadlessAngularFeature[]): EnvironmentProviders;

declare class SafeStyleService {
    private readonly document;
    private readonly responsiveStyles;
    private styleElement?;
    registerResponsiveStyles(key: string, css: string): void;
    private flush;
    registerCustomStyles(key: string, css: string | undefined, scope: string): void;
    toInlineStyles(style: BlockStyle | undefined, allowedProperties?: readonly string[]): Record<string, string | number>;
    value(style: BlockStyle | undefined, property: string): string | number | undefined;
    responsiveCss(style: BlockStyle | undefined, selector: string, allowedProperties?: readonly string[]): string;
    responsiveCssProperty(style: BlockStyle | undefined, property: string, selector: string, cssProperty?: string): string;
    spacing(style: BlockStyle | undefined, property: string, prefix?: string): Record<string, string | number>;
    private scalarValue;
    private isBreakpointMap;
    private cssRules;
    private appendResponsiveDeclaration;
    private toCssProperty;
    private scopeCustomCss;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<SafeStyleService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<SafeStyleService>;
}

export { BasicBlockComponent, BlockComponentRegistry, DEFAULT_ANGULAR_BLOCKS, FeaturedCardsComponent, FormComponent, HEADLESS_ANGULAR_CONFIG, HEADLESS_CONTENT_CLIENT, HeadlessBlockOutletComponent, HeadlessPageRendererComponent, HeroComponent, InteractiveBlockComponent, NavigationRendererComponent, SafeStyleService, TimelineComponent, UnsupportedBlockComponent, provideHeadlessAngular };
export type { AngularBlockRegistration, BlockComponent, HeadlessAngularConfig, HeadlessAngularFeature };
//# sourceMappingURL=jmgduarte-headless-angular.d.ts.map
