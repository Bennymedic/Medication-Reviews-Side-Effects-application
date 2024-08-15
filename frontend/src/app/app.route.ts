import { Router, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin.component';
import { SignupComponent } from './auth/signup.component';
import { ListComponent } from './medication/list.component';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AddReviewComponent } from './medication/review/add-review.component';
import { MedicationComponent } from './medication/medication.component';
import { ReviewListComponent } from './medication/review/review-list.component';
import { ReviewComponent } from './medication/review/review.component';

const signin_guard = () => {
  const router = inject(Router);
  const signed_in = inject(AuthService).is_logged_in();
  if (signed_in) {
    router.navigate(['']);
    return false;
  } else {
    return true;
  }
};
export const routes: Routes = [
  { path: '', redirectTo: 'medications/list', pathMatch: 'full' },
  { path: 'medications/list', component: ListComponent },
  {
    path: 'medications/:medication_id/reviews/list/all',
    component: ReviewListComponent,
  },

  { path: 'signin', component: SigninComponent, canActivate: [signin_guard] },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [() => !inject(AuthService).is_logged_in()],
  },
  {
    path: 'medications',
    loadChildren: () =>
      import('./medication/medication.route').then((c) => c.medication_routes),
    canActivate: [() => inject(AuthService).is_logged_in()],
  },
  {
    path: 'medications/:medication_id/reviews/selected/:review_id',
    component: ReviewComponent,
  },
  { path: 'medications/:medication_id', component: MedicationComponent },
  { path: '**', redirectTo: '' },
];
