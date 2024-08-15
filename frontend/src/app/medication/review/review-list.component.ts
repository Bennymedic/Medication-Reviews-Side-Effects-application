import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';
import { MedicationService } from '../medication.service';
import { Review } from '../../types';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    MatGridListModule,
  ],
  template: `
    <h1 class="title">Reviews</h1>
    @if(auth.is_logged_in()){
       <button mat-raised-button color="accent" (click)="add(medication_id())" class="add-review-button">Add Review</button>
    }
    @for(review of reviews(); track review){
    <mat-grid-list cols="1" rowHeight="15:1" class="review-list">
      <mat-grid-tile class="review-item">
        <li>
          <a [routerLink]="['', 'medications', medication_id(), 'reviews', 'selected', review._id ]" class="review-link">
            {{review.review}} : <span class="gold">{{review.rating.toFixed(1)}}</span>
          </a>
        </li>
      </mat-grid-tile>
    </mat-grid-list>
    }@empty {
    <p class="no-reviews">No Reviews Available for Today! Try to Add One</p>
    }
  `,
  styleUrl: '../CSS/review-list.component.css',
})
export class ReviewListComponent {
  readonly med_service = inject(MedicationService);
  readonly auth = inject(AuthService);
  medication_id = input<string>('');


  #router = inject(Router);
  reviews = signal<Review[]>([]);
  
  constructor(){
    effect(()=>{
      if (this.medication_id() !== ''){
        this.med_service.getReviews(this.medication_id()).subscribe(response=>{
          if(response.success){
            this.reviews.set(response.data);
          }
        });
      }
    });
  }
  
  add(medication_id: string){
    this.#router.navigate(['', 'medications', medication_id, 'reviews', 'add']);
  }
}
