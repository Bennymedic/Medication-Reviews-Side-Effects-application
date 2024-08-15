import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MedicationService } from './medication.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatGridListModule } from '@angular/material/grid-list';

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    NgClass,
    RouterLink,
    MatGridListModule,
  ],
  template: `
    <h1 class="title">Drugs & Medications A to Z</h1>
    <div class="button-row">
      @for(chr of chrs(); track chr) {
        <button mat-raised-button (click)="displayDetails(chr)" class="alphabet-button">{{ chr }}</button>
      }
    </div>


      <mat-grid-list cols="1" rowHeight="30:1" >
        @for(medication of med_service.med_list(); track medication) {
          <mat-grid-tile>
            <li class="medication-item">
              <a [routerLink]="['', 'medications', medication._id]" class="medication-link">
                {{ medication.name }}
              </a>
            </li>
          </mat-grid-tile>
        }@empty {
      <p class="no-medications">No Medication available for today! Try to add one.</p>
    }
      </mat-grid-list>


    
  `,
  styleUrl:'./CSS/list.component.css',
})
export class ListComponent {
  chrs = signal<string[]>(letters);
  med_service = inject(MedicationService);
  readonly auth = inject(AuthService);

  constructor() {
    effect(() => {
      this.med_service.getMedication$().subscribe((response) => {
        if (response.success) {
          this.med_service.med_list.set(response.data);
        }
      });
    });
  }

  displayDetails(chr: string) {
    this.med_service.getMedication$(chr).subscribe((response) => {
      if (response.success) {
        this.med_service.med_list.set(response.data);
      }
    });
  }
}
