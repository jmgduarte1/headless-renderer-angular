import { NgClass, NgComponentOutlet, NgStyle } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, DestroyRef, effect, inject, Injector, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageBlock, SchemaInteractiveBlock } from '@jmgduarte/headless-core';
import { SafeStyleService } from '../../core/rendering/safe-style.service';
import { BlockComponentRegistry } from '../../core/registry/block-component-registry';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'headless-interactive-block',
  imports: [NgClass, NgComponentOutlet, NgStyle, MatExpansionModule, MatTabsModule, MatIconModule, MatTooltipModule],
  templateUrl: './interactive-block.component.html',
  styleUrl: './interactive-block.component.scss',
})
export class InteractiveBlockComponent {
  readonly block = input.required<SchemaInteractiveBlock>();
  private readonly styleService = inject(SafeStyleService);
  private readonly registry = inject(BlockComponentRegistry);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly injector = inject(Injector);
  readonly data = computed(() => this.block().data);
  readonly responsiveClass = computed(() => `headless-responsive-${this.block().id.replace(/[^a-zA-Z0-9_-]/g, '-')}`);
  readonly styles = computed(() => this.styleService.toInlineStyles(this.block().style));
  readonly activeTab = signal(0);
  readonly isMobile = signal(false);
  readonly classes = computed(() => {
    const align = this.data().attributes?.['align'];
    return {
      alignnone: align === 'none',
      alignwide: align === 'wide',
      alignfull: align === 'full',
    };
  });

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

  selectTab(index: number): void {
    this.activeTab.set(index);
  }

  openAccordion(index: number): void {
    this.activeTab.set(index);
  }

  closeAccordion(index: number): void {
    if (this.activeTab() === index) {
      this.activeTab.set(-1);
    }
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.data().tabs ?? [];
    const vertical = this.data().orientation === 'vertical';
    const previous = vertical ? 'ArrowUp' : 'ArrowLeft';
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    let target = index;

    if (event.key === next) target = (index + 1) % tabs.length;
    else if (event.key === previous) target = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = tabs.length - 1;
    else return;

    event.preventDefault();
    this.selectTab(target);
    queueMicrotask(() => document.getElementById(this.tabId(target))?.focus());
  }

  tabId(index: number): string {
    return `${this.block().id}-tab-${index}`;
  }

  panelId(index: number): string {
    return `${this.block().id}-tabpanel-${index}`;
  }

  childComponent(child: PageBlock) {
    return this.registry.resolve(child);
  }

}
