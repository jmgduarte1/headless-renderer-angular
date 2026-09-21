import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { ContentClient, UnsupportedBlockStrategy } from '@jmgduarte/headless-core';
import { AngularBlockRegistration, BlockComponentRegistry } from '../registry/block-component-registry';

export interface HeadlessAngularConfig {
  renderPageTitle?: boolean;
  unsupportedBlocks?: {
    strategy?: UnsupportedBlockStrategy;
    component?: AngularBlockRegistration['component'];
  };
  blocks?: readonly AngularBlockRegistration[];
  contentClient?: ContentClient;
}

export const HEADLESS_ANGULAR_CONFIG = new InjectionToken<Required<Pick<HeadlessAngularConfig, 'renderPageTitle'>> & HeadlessAngularConfig>('HEADLESS_ANGULAR_CONFIG');
export const HEADLESS_CONTENT_CLIENT = new InjectionToken<ContentClient>('HEADLESS_CONTENT_CLIENT');

export type HeadlessAngularFeature = EnvironmentProviders;

export function provideHeadlessAngular(
  config: HeadlessAngularConfig = {},
  ...features: HeadlessAngularFeature[]
): EnvironmentProviders {
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
