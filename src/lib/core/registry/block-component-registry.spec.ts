import { Component } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { BlockComponentRegistry } from './block-component-registry';

@Component({ template: '' })
class CustomBlockComponent {}

describe('BlockComponentRegistry', () => {
  it('resolves defaults and supports application overrides', () => {
    const registry = new BlockComponentRegistry();
    expect(registry.has('hero')).toBe(true);
    registry.register('hero', CustomBlockComponent);
    expect(registry.resolve({ id: 'hero-1', type: 'hero' })).toBe(CustomBlockComponent);
  });

  it('supports registration lifecycle', () => {
    const registry = new BlockComponentRegistry([{ type: 'custom', component: CustomBlockComponent }]);
    expect(registry.has('custom')).toBe(true);
    expect(registry.unregister('custom')).toBe(true);
    expect(registry.has('custom')).toBe(false);
  });

  it('resolves unsupported blocks with fallback by default', () => {
    const registry = new BlockComponentRegistry();
    expect(registry.resolve({ id: 'unknown-1', type: 'unknown' })).toBeTruthy();
  });

  it('supports skip and error strategies', () => {
    const skipped = new BlockComponentRegistry([], { strategy: 'skip' });
    expect(skipped.resolve({ id: 'unknown-1', type: 'unknown' })).toBeTruthy();

    const error = new BlockComponentRegistry([], { strategy: 'error' });
    expect(() => error.resolve({ id: 'unknown-1', type: 'unknown' })).toThrow('Unsupported block type: unknown');
  });
});
