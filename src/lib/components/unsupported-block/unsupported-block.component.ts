import { Component, input } from '@angular/core';
import { PageBlock } from '@jmgduarte/headless-core';

@Component({
  selector: 'headless-unsupported-block',
  templateUrl: './unsupported-block.component.html',
  styleUrl: './unsupported-block.component.scss',
})
export class UnsupportedBlockComponent {
  readonly block = input.required<PageBlock>();
}


