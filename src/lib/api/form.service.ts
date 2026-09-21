import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { FormSubmissionResponse } from '@jmgduarte/headless-core';
import { HEADLESS_CONTENT_CLIENT } from '../core/config/headless-angular-config';

@Injectable({ providedIn: 'root' })
export class FormService {
  private readonly client = inject(HEADLESS_CONTENT_CLIENT, { optional: true });

  submit(formId: string, values: Record<string, unknown>, nonce?: string): Observable<FormSubmissionResponse> {
    if (!this.client) throw new Error('No ContentClient configured for form submission.');
    return from(this.client.submitForm(formId, values, nonce));
  }
}
