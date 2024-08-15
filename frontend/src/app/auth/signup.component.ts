import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../types';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="signup-container">
      <form [formGroup]="form" (ngSubmit)="go()" class="signup-form">
        <h2>Sign Up</h2>
        <input placeholder="Full Name" formControlName="fullname" class="input-field">
        @if(fullname.invalid && (fullname.dirty || fullname.touched)){
        <div>
          @if(password.errors?.['required']){
          <div style="color:red">Full Name is required</div>
          }
      
        </div>
        }
        <input placeholder="Email" formControlName="email" class="input-field" type="email">
        @if(email.invalid && (email.dirty || email.touched)){
        <div>
          @if(email.errors?.['required']){
          <div style="color:red">Email is required</div>
          } @if(email.errors?.['email']){
          <div style="color:red">Email is not valid</div>
          }
        </div>
        }
        <input placeholder="Password" formControlName="password" class="input-field" type="password">
        @if(password.invalid && (password.dirty || password.touched)){
        <div>
          @if(password.errors?.['required']){
          <div style="color:red">Password is required</div>
          }
      
        </div>
        }
        <button type="submit" [disabled]="form.invalid" class="submit-button">Sign Up</button>
      </form>
    </div>
  `,
  styleUrl: '../medication/CSS/auth.css',
})
export class SignupComponent {
  readonly #auth = inject(AuthService);
  #router = inject(Router);
  form = inject(FormBuilder).group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
get email(){return this.form.get('email') as FormControl}
get fullname(){return this.form.get('fullname') as FormControl}
get password(){return this.form.get('password') as FormControl}
  go() {
    if (this.form.valid) {
      this.#auth.signup(this.form.value as User).subscribe((response: any) => {
        if (response.success) {
          this.#router.navigate(['signin']);
        }
      });
    }
  }
}
