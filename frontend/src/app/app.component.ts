import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService, initial_state } from './auth/auth.service';
import { ListComponent } from './medication/list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ListComponent],
  template: `
    <div class="welcome-container">
      <h1>Welcome {{ auth.state$().fullname }}!</h1>
      @if(auth.is_logged_in()){
      <nav>
        <ul>
          <li><a [routerLink]="['medications', 'add']">Add Medication</a></li>
          <li><a (click)="logout()">Logout</a></li>
        </ul>
      </nav>
      }@else {
      <nav>
        <ul>
          <li><a [routerLink]="['signup']">SignUp</a></li>
          <li><a [routerLink]="['signin']">SignIn</a></li>
        </ul>
      </nav>
      }
      <router-outlet />
    </div>
  `,
    styleUrl:'./medication/CSS/app.component.css',
})
export class AppComponent {
  auth = inject(AuthService);
  readonly #router = inject(Router);

  logout() {
    this.auth.state$.set(initial_state);
    this.#router.navigate(['']);
  }
}
