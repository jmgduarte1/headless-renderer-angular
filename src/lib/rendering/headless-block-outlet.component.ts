import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { PageBlock } from '@jmgduarte/headless-core';
import { BlockComponentRegistry } from '../core/registry/block-component-registry';

@Component({
  selector: 'headless-block-outlet',
  imports: [NgComponentOutlet],
  template: '<ng-container *ngComponentOutlet="component(); inputs: { block: block() }" />',
})
export class HeadlessBlockOutletComponent {
  readonly block = input.required<PageBlock>();
  private readonly registry = inject(BlockComponentRegistry);
  readonly component = computed(() => this.registry.resolve(this.block()));
}
