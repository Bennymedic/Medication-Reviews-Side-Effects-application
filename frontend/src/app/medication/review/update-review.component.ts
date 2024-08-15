import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicationService } from '../medication.service';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../../types';

@Component({
  selector: 'app-update-review',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
     <h2 class="form-title">Update Review</h2>
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
   styleUrl: '../medication.component.css'
})
export class UpdateReviewComponent {
  medication_id = input<string>('');
  review_id = input<string>('');
  readonly #router = inject(Router);
  readonly #med_service = inject(MedicationService)
  form = inject(FormBuilder).nonNullable.group({
    _id:'',
    review: '',
    rating: 0,
    by: { user_id: '', fullname: '' }, 
    date: 0
  });
  #notification = inject(ToastrService)
  constructor() {
    effect(() => {
      if (this.medication_id() !== '') {
        this.#med_service
          .getReviewById(this.medication_id(), this.review_id())
          .subscribe((response) => {
            if (response.success) {
              this.form.patchValue(response.data);
            }
          });
      }
    });
  }

  go(medication_id:string) {
    this.#med_service
      .updateReview(medication_id, this.form.value as Review)
      .subscribe((response) => {
        if (response.success) {
          this.#notification.success(`Review is updated successfully`);
          this.#router.navigate(['', 'medications', medication_id, 'reviews', 'list']);
        } else {
          this.#notification.error(`Something went wrong try again`);
        }
      });
  }
}
