import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormBlock, FormFieldSchema } from '@jmgduarte/headless-core';
import { FormService } from '../../api/form.service';
import { SafeStyleService } from '../../core/rendering/safe-style.service';

@Component({
  selector: 'headless-form',
  imports: [NgClass, NgStyle, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  readonly block = input.required<FormBlock>();
  private readonly formService = inject(FormService);
  private readonly styleService = inject(SafeStyleService);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly data = computed(() => this.block().data);
  readonly styles = computed(() => this.styleService.toInlineStyles(this.block().style));
  readonly form = computed(() => {
    const controls: Record<string, FormControl<unknown>> = {};
    for (const field of this.data().fields) {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      controls[field.name] = new FormControl<unknown>(field.type === 'checkbox' ? [] : '', validators);
    }
    return new FormGroup(controls);
  });

  control(field: FormFieldSchema): FormControl<unknown> {
    return this.form().controls[field.name] as FormControl<unknown>;
  }

  isChecked(field: FormFieldSchema, value: string): boolean {
    const selected = this.control(field).value;
    return Array.isArray(selected) && selected.includes(value);
  }

  toggleCheckbox(field: FormFieldSchema, value: string, checked: boolean): void {
    const selected = Array.isArray(this.control(field).value) ? [...this.control(field).value as string[]] : [];
    const next = checked ? [...new Set([...selected, value])] : selected.filter((item) => item !== value);
    this.control(field).setValue(next);
    this.control(field).markAsDirty();
  }

  submit(): void {
    if (this.form().invalid || this.submitting()) {
      this.form().markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.formService.submit(this.data().formId, this.form().getRawValue(), this.data().submit.nonce).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.successMessage.set(response.message ?? this.data().successMessage ?? 'Your form has been submitted successfully.');
        this.form().reset();
      },
      error: (error: { error?: { message?: string } }) => {
        this.submitting.set(false);
        this.errorMessage.set(error.error?.message ?? this.data().failureMessage ?? 'The form could not be submitted.');
      },
    });
  }
}


