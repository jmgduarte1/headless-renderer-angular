import { NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { PageSchema } from '@jmgduarte/headless-core';
import { HEADLESS_ANGULAR_CONFIG } from '../../core/config/headless-angular-config';
import { HeadlessBlockOutletComponent } from '../../rendering/headless-block-outlet.component';

@Component({
  selector: 'headless-page-renderer',
  imports: [NgClass, HeadlessBlockOutletComponent],
  templateUrl: './headless-page-renderer.component.html',
  styleUrl: './headless-page-renderer.component.scss',
})
export class HeadlessPageRendererComponent {
  readonly schema = input.required<PageSchema>();
  private readonly config = inject(HEADLESS_ANGULAR_CONFIG);
  readonly shouldRenderPageTitle = computed(() => this.config.renderPageTitle !== false);
  alignmentClasses(block: PageSchema['page']['blocks'][number]) {
    return {
      alignnone: block.align === 'none',
      alignwide: block.align === 'wide',
      alignfull: block.align === 'full',
    };
  }

  readonly resolvedBlocks = computed(() => this.schema().page.blocks);
}
