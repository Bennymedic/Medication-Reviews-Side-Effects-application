import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicationService } from '../medication.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="form-title">Add Review</h2>
    <form [formGroup]="form" (ngSubmit)="go(medication_id())" class="form-container">
      <div class="form-group">
        <input placeholder="Review" formControlName="review" class="form-control" />
      </div>
      <div class="form-group">
        <input placeholder="Rating" formControlName="rating" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `,
   styleUrl: '../medication.component.css',
})
export class AddReviewComponent {
  medication_id = input<string>('');
  readonly #router = inject(Router);
  readonly #med_service = inject(MedicationService);
  readonly #notification = inject(ToastrService);

  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: ['', Validators.required],
  });

  go(medication_id: string) {
    this.#med_service
      .addReview(medication_id, this.form.value as {review:string, rating:string})
      .subscribe((response) => {
        if (response.success) {
          this.#notification.success(`Review is added successfully`);
          this.#router.navigate(['']);
        } else {
          this.#notification.error(`Something went wrong, try again`);
        }
      });
  }
}
