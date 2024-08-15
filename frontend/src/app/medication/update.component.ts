import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MedicationService } from './medication.service';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="form-title">Update medication</h2>
    <form [formGroup]="form" (ngSubmit)="go()" class="form-container">
      <div class="form-group">
        <input placeholder="Name" formControlName="name" class="form-control" />
      </div>
      <div class="form-group">
        <input placeholder="Generic Name" formControlName="generic_name" class="form-control" />
      </div>
      <div class="form-group">
        <input placeholder="Medication Class" formControlName="medication_class" class="form-control" />
      </div>
      <div class="form-group">
        <label for="mySelect">Choose availability option:</label>
        <select id="mySelect" formControlName="availability" class="form-control">
          <option value="Prescription">Prescription</option>
          <option value="OTC">OTC</option>
        </select>
      </div>
      <div class="form-group">
        <input type="file" formControlName="image" (change)="setFile($event)" class="form-control-file" />
      </div>
      <button type="submit" class="btn btn-primary">Go</button>
    </form>
  `,
  styleUrl: './medication.component.css',
})
export class UpdateComponent {
  file!: File;
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);
  readonly #med_service = inject(MedicationService);

  medication_id = input<string>('');

  form = inject(FormBuilder).nonNullable.group({
    _id: '',
    name: ['', Validators.required],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: ['', Validators.required],
    image: [null, Validators.required],
    added_by: { user_id: '', fullname: '', email: '' },
    reviews: [],
    first_letter: ''
  });

  constructor() {
    effect(() => {
      if (this.medication_id() !== '') {
        this.#med_service
          .getMedicationById(this.medication_id())
          .subscribe((response) => {
            if (response.success) {
              this.form.controls.name.patchValue(response.data.name)
              this.form.controls.generic_name.patchValue(response.data.generic_name)
              this.form.controls.availability.patchValue(response.data.availability)
              this.form.controls.medication_class.patchValue(response.data.medication_class)
            }
          });
      }
    });
  }

  go() {
    const formData = new FormData();
    formData.append('medication_image', this.file);
    formData.append('name', this.form.controls.name.value);
    formData.append('generic_name', this.form.controls.generic_name.value);
    formData.append('availability', this.form.controls.availability.value);
    formData.append('medication_class', this.form.controls.medication_class.value);

    this.#med_service.updateMedication(this.medication_id(), formData)
      .subscribe((response) => {
        if (response.success) { 
          this.#notification.success(`Medication is updated successfully`);
          this.#router.navigate(['']);
        } else {
          this.#notification.error(`Something went wrong, try again`);
        }
      });
  }

  setFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }
}
