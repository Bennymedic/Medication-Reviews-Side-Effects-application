import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MedicationService } from './medication.service';
import { Image, Medication, Review } from '../types';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@Component({
  selector: 'app-medication',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatGridListModule,
    RouterLink,
    MatCardModule,
    MatProgressBarModule
  ],
  template: `

<div class="container">

    <mat-card class="example-card">
      <mat-card-header>
        <mat-card-title class="boldText">{{ medication.name }}</mat-card-title>
      </mat-card-header>
      <img
        mat-card-image
        src="http://localhost:3000/medications/images/{{
          medication.image?._id
        }}"
        [alt]="medication.name"
      />

      <mat-card-content>
        <p>Availability: {{ medication.availability }}</p>
      </mat-card-content>
      <mat-card-content>
        <p>Medication Class: {{ medication.medication_class }}</p>
      </mat-card-content>
      <mat-card-content>
       <h3 style="color: gold"> <a [routerLink]="['', 'medications', medication._id, 'reviews', 'list', 'all']"
          >Rating: <mat-progress-bar mode="determinate" value="{{review_ave() * 20}}" color="gold" style="color: red"></mat-progress-bar>
          </a>{{ review_ave() }}/5</h3>
      </mat-card-content>
    </mat-card>
<br/>
    <mat-grid-list cols="2" rowHeight="4:1">
      <mat-grid-tile>
        @if(medication.added_by.user_id === auth.state$()._id){
        <button
          mat-raised-button
          color="accent"
          (click)="update(medication._id)"
        >
          update
        </button>
        <button mat-raised-button color="warn" (click)="delete(medication._id)">
          delete
        </button>
        }
      </mat-grid-tile>
    </mat-grid-list>
    </div>
  `,
  styleUrl: './medication.component.css',
})
export class MedicationComponent {
  medication_id = input<string>('');
  readonly med_Service = inject(MedicationService);
  readonly auth = inject(AuthService);
  #router = inject(Router);
  medication: Medication = {
    _id: '',
    name: '',
    first_letter: '',
    generic_name: '',
    medication_class: '',
    availability: '',
    added_by: { user_id: '', fullname: '', email: '' },
    reviews: [],
    image: { filename: '', originalname: '' },
  };
  med_service = inject(MedicationService);
  reviews = signal<Review[]>([]);

  review_ave = signal<number>(0);

  constructor() {

    effect(() => {
      if (this.medication_id() !== '') {
        this.med_Service
          .getMedicationById(this.medication_id())
          .subscribe((response) => {
            this.medication = response.data;
            this.computeAveRating(response.data);
          });
      }
    });
  }
  computeAveRating(arr: Medication) {
    if (arr.reviews.length > 0) {
      let computed =
        arr.reviews.reduce((acc, cur) => {
          return acc + cur.rating;
        }, 0) / arr.reviews.length;
      this.review_ave.set(computed);
    }
  }

  update(medication_id: string) {
    this.#router.navigate(['medications', 'update', medication_id]);
  }

  delete(medication_id: string) {
    this.med_service
      .deleteMedicationById(medication_id)
      .subscribe((response) => {
        if (response.success) {
          this.med_Service.med_list.update((old) =>
            old.filter((med) => med._id !== medication_id)
          );
            this.#router.navigate(['', 'medications', 'list'])
        }
      });
  }
}
