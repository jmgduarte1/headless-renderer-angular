# `@jmgduarte/headless-angular`

Free Angular renderer for valid Headless Core page and navigation schemas. It renders Core models without requiring that the data came from `module-rest`; applications can supply content from any source through the Core content-client port.

## Responsibilities

- Provides standalone Angular block, page, and navigation renderer components.
- Resolves blocks through `BlockComponentRegistry`, with configurable registrations and fallback/skip/error behavior for unsupported blocks.
- Provides renderer configuration, content-client injection, and safe style handling.
- Accepts generic Angular feature providers through the optional feature arguments to `provideHeadlessAngular()`.

This Free package does not export or depend on Premium renderers or SEO capabilities. `module-angular-premium` can add features through the generic provider extension point without creating a dependency from Free to Premium.

## Basic setup

```ts
import { provideHeadlessAngular } from '@jmgduarte/headless-angular';

export const appConfig = {
  providers: [
    provideHeadlessAngular({
      contentClient,
      renderPageTitle: false,
      unsupportedBlocks: { strategy: 'fallback' },
    }),
  ],
};
```

Import the standalone component used by the template:

```ts
import { HeadlessPageRendererComponent } from '@jmgduarte/headless-angular';

@Component({
  imports: [HeadlessPageRendererComponent],
  template: '<headless-page-renderer [schema]="page" />',
})
export class PageView {}
```

The library also exports `NavigationRendererComponent` and the block components for direct composition. `provideHeadlessAngular(config, ...features)` accepts `EnvironmentProviders` features; Premium features may be passed by applications that install `module-angular-premium`.

## Local development

From this directory:

```sh
npm install
npm run typecheck
npm test
npm run build
```

`npm test` runs the Angular library tests in non-watch mode. This package is currently private and resolves Core from the sibling local package in this workspace. Angular common/core/forms/router and related framework packages are peer requirements as declared in `package.json`.
