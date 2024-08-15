import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MedicationService } from './medication.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="form-title">Add new Medication</h2>
    <form [formGroup]="form" (ngSubmit)="go()" class="form-container">
      <div class="form-group">
        <input
          placeholder="Name"
          formControlName="name"
          class="form-control"
        />
        @if(name.invalid && name.touched && name.dirty ){
            @if(name.errors?.['data']){
              <div style="color:red">Name already exist in Database</div>
            }
            @if(name.errors?.['required']){
              <div style="color:red">Name is required</div>
            }
        }
        <br />
      </div>
      <div class="form-group">
        <input
          placeholder="Generic Name"
          formControlName="generic_name"
          class="form-control"
        /><br />
        @if(generic_name.invalid && generic_name.touched && generic_name.dirty ){
            @if(generic_name.errors?.['required']){
              <div style="color:red">Generic Name is required</div>
            }
        }
        <br />
      </div>
      <div class="form-group">
        <input
          placeholder="Medication Class"
          formControlName="medication_class"
          class="form-control"
        /><br />
        @if(medication_class.invalid && medication_class.touched && medication_class.dirty ){
            @if(medication_class.errors?.['required']){
              <div style="color:red">Medication Class is required</div>
            }
        }
        <br />
      </div>
      <div class="form-group">
        <label for="mySelect">Choose availability option:</label>
        <select
          id="mySelect"
          formControlName="availability"
          class="form-control"
        >
          <option value="Prescription">Prescription</option>
          <option value="OTC">OTC</option>
        </select>
      </div>
      <br />
      <div class="form-group">
        <input
          type="file"
          formControlName="image"
          (change)="setFile($event)"
          class="form-control-file"
        />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `,
  styleUrls: ['./medication.component.css'],
})
export class AddComponent {
  file!: File;
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);
  readonly med_service = inject(MedicationService);

  form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required, [this.asyncValidatorFactory(this.med_service)]],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: ['OTC', Validators.required],
    image: '',
  });
  go() {
    const formData = new FormData();
    formData.append('medication_image', this.file);
    formData.append('name', this.form.controls.name.value);
    formData.append('generic_name', this.form.controls.generic_name.value);
    formData.append('availability', this.form.controls.availability.value);
    formData.append('medication_class', this.form.controls.medication_class.value);

    this.med_service.addMedication(formData).subscribe((response) => {
      if (response.success) {
        this.#notification.success(`Medication is added successfully`);
        this.#router.navigate(['']);
      } else {
        this.#notification.error(`Something went wrong try again`);
      }
    });
  }

  setFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }

  get name() {return this.form.get('name') as FormControl }
  get generic_name() {return this.form.get('generic_name') as FormControl }
  get medication_class() {return this.form.get('medication_class') as FormControl }

  asyncValidatorFactory(medService: MedicationService) {
    return (control: AbstractControl): Observable<any> => { 
      return medService.validateName(control.value)
    };
  }
}
