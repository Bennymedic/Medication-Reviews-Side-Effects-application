import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, State } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../types';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="signup-container">
      <form [formGroup]="form" (ngSubmit)="go()" class="signup-form">
        <h2>Sign In</h2>
        <input
          placeholder="Email"
          formControlName="email"
          class="input-field"
        />
        @if(email.invalid && (email.dirty || email.touched)){
        <div>
          @if(email.errors?.['required']){
          <div style="color:red">Email is required</div>
          } @if(email.errors?.['email']){
          <div style="color:red">Email is not valid</div>
          }
      
        </div>
        }
        <input
          placeholder="Password"
          formControlName="password"
          class="input-field"
          type="password"
        />
        @if(password.invalid && (password.dirty || password.touched)){
        <div>
          @if(password.errors?.['required']){
          <div style="color:red">Password is required</div>
          }
      
        </div>
        }
        <button type="submit" [disabled]="form.invalid" class="submit-button">
          Sign In
        </button>
      </form>
    </div>
  `,
  styleUrl: '../medication/CSS/auth.css',
})
export class SigninComponent {
  readonly #auth = inject(AuthService);
  readonly #notification = inject(ToastrService);
  #router = inject(Router);
  form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get email() { return this.form.get('email') as FormControl }
  get password() { return this.form.get('password') as FormControl }
  go() {
    this.#auth.signin(this.form.value as User).subscribe({
      next: (response) => {
        if (response.success) {
          const decodedToken = jwtDecode(response.data) as State;
          this.#auth.state$.set({
            _id: decodedToken._id,
            fullname: decodedToken.fullname,
            email: decodedToken.email,
            jwt: response.data,
          });
        }
        console.log(this.#auth.state$().jwt);
      },
      error: (error) => {
        this.#notification.error(`Invalid Username or Password`);
      },
    });
    this.#router.navigate(['']);
  }

}
