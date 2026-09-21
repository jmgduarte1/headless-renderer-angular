import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, effect, inject, Injector, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { TimelineBlock, TimelinePeriod } from '@jmgduarte/headless-core';
import { SafeStyleService } from '../../core/rendering/safe-style.service';

@Component({ selector: 'headless-timeline', imports: [NgClass, NgStyle, MatButtonModule, MatListModule], templateUrl: './timeline.component.html', styleUrl: './timeline.component.scss' })
export class TimelineComponent {
  readonly block = input.required<TimelineBlock>();
  private readonly styleService = inject(SafeStyleService);
  private readonly injector = inject(Injector);
  readonly data = computed(() => this.block().data);
  readonly styles = computed(() => this.styleService.toInlineStyles(this.block().style));
  readonly linkClass = computed(() => `timeline__link--${this.data().linkPosition ?? 'end'}`);
  readonly compactPeriods = computed(() => this.data().periods.filter(period => period.compact));
  readonly compactExpanded = signal(false);
  readonly compactPeriodState = signal<Record<string, boolean>>({});
  private readonly initializeCompactState = effect(() => {
    const periods = this.compactPeriods();
    const current = this.compactPeriodState();
    const next = { ...current };
    let changed = false;
    for (const period of periods) {
      if (!(period.id in next)) { next[period.id] = period.expanded === true; changed = true; }
    }
    if (changed) this.compactPeriodState.set(next);
  }, { injector: this.injector });
  periodStyles(period: TimelinePeriod): Record<string, string | number> { return period.style ? this.styleService.toInlineStyles(period.style) : {}; }
  toggleCompactPeriods(): void {
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
  isPeriodExpanded(period: TimelinePeriod): boolean { return this.compactExpanded() || this.compactPeriodState()[period.id] === true; }
  onDetailsToggle(period: TimelinePeriod, event: Event): void { this.compactPeriodState.update(state => ({ ...state, [period.id]: (event.target as HTMLDetailsElement).open })); }
  formatDate(value: string): string { const [year, month] = value.split('-'); const date = new Date(Number(year), Number(month) - 1, 1); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date).toUpperCase(); }
  periodRange(period: TimelinePeriod): string { return `${this.formatDate(period.start)} - ${this.formatDate(period.end)}`; }
}

