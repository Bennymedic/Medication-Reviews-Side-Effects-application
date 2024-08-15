import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MedicationService } from '../medication.service';
import { Review } from '../../types';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [MatButtonModule, MatGridListModule, DatePipe],
  template: `
    <div class="review-card">
      <div class="review-content">
        <p class="review-text">Comment: {{review().review}}</p>
        <p class="review-rating">Rating: <span class="gold">{{review().rating}}</span></p>
        <p class="review-author">Full Name: {{review().by.fullname}}</p>
        <p class="review-date">Date: {{review().date | date }}</p>
      </div>
      <div class="review-actions">  
        @if(review().by.user_id === auth.state$()._id){
          <button mat-raised-button color="accent" (click)="update(medication_id(), review())" class="action-button">Edit</button>
          <button mat-raised-button color="warn" (click)="delete(medication_id(), review()._id!)" class="action-button">Delete</button>
        }
      </div>
    </div>
  `,

styleUrl: '../CSS/review.component.css',
})
export class ReviewComponent {
  readonly auth = inject(AuthService);
  #router = inject(Router);
  medication_id = input<string>('');
  review_id = input<string>('');
  med_service = inject(MedicationService);
  review = signal<Review>({ _id: '', review: '', rating: 0, by: { user_id: '', fullname: '' }, date: 0 });

  constructor() {
    effect(() => {
      this.med_service.getReviewById(this.medication_id(), this.review_id()).subscribe(response => {
        if (response.success) {
          this.review.set(response.data);
        }
      });
    });
  }

  update(medication_id: string, review: Review) {
    this.#router.navigate(['medications', medication_id, 'reviews', 'update', review._id]);
  }

  delete(medication_id: string, review_id: string) {
    this.med_service.deleteReviews(medication_id, review_id);
    this.#router.navigate(['']);
  }
}
