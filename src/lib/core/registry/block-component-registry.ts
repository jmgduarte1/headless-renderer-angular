import { Component, Injectable, Type } from '@angular/core';
import { PageBlock, UnsupportedBlockStrategy } from '@jmgduarte/headless-core';
import { BasicBlockComponent } from '../../components/basic-block/basic-block.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturedCardsComponent } from '../../components/featured-cards/featured-cards.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { UnsupportedBlockComponent } from '../../components/unsupported-block/unsupported-block.component';
import { InteractiveBlockComponent } from '../../components/interactive-block/interactive-block.component';
import { FormComponent } from '../../components/form/form.component';

export type BlockComponent = Type<unknown>;
export interface AngularBlockRegistration { type: string; component: BlockComponent; }

function lazyRegistration(type: string, component: () => BlockComponent): AngularBlockRegistration {
  return {
    type,
    get component() {
      return component();
    },
  };
}

export const DEFAULT_ANGULAR_BLOCKS: readonly AngularBlockRegistration[] = [
  ...['container', 'text', 'image', 'link', 'spacer', 'details', 'separator'].map((type) => lazyRegistration(type, () => BasicBlockComponent)),
  lazyRegistration('hero', () => HeroComponent),
  lazyRegistration('featured-cards', () => FeaturedCardsComponent),
  lazyRegistration('timeline', () => TimelineComponent),
  ...['tabs', 'accordion', 'gallery', 'tooltip'].map((type) => lazyRegistration(type, () => InteractiveBlockComponent)),
  lazyRegistration('form', () => FormComponent),
];

@Injectable({ providedIn: 'root' })
export class BlockComponentRegistry {
  private readonly components = new Map<string, BlockComponent>();
  private readonly fallback: BlockComponent;
  private readonly strategy: UnsupportedBlockStrategy;

  constructor(registrations: readonly AngularBlockRegistration[] = [], unsupported: { strategy?: UnsupportedBlockStrategy; component?: BlockComponent } = {}) {
    this.fallback = unsupported.component ?? UnsupportedBlockComponent;
    this.strategy = unsupported.strategy ?? 'fallback';
    this.registerMany(DEFAULT_ANGULAR_BLOCKS);
    this.registerMany(registrations);
  }

  register(type: string, component: BlockComponent): void { this.components.set(type, component); }
  registerMany(registrations: readonly AngularBlockRegistration[]): void { registrations.forEach(({ type, component }) => this.register(type, component)); }
  unregister(type: string): boolean { return this.components.delete(type); }
  has(type: string): boolean { return this.components.has(type); }
  resolve(block: PageBlock): BlockComponent {
    const component = this.components.get(block.type);
    if (component) return component;
    if (this.strategy === 'error') throw new Error(`Unsupported block type: ${block.type}`);
    return this.strategy === 'skip' ? EmptyBlockComponent : this.fallback;
  }
}

@Component({ template: '' })
class EmptyBlockComponent {}
