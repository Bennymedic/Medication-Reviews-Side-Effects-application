import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';

import { User } from '../types';
import { environment } from '../../environments/environment.development';

export interface State {
  _id: string;
  fullname: string;
  email: string;
  jwt: string;
}

export const initial_state = {
  _id: '',
  fullname: 'Guest',
  email: '',
  jwt: '',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);
  state$ = signal<State>(initial_state);
  constructor(){
    effect(()=>{
      localStorage.setItem('finalProject',JSON.stringify(this.state$()));
    })
  }
  signup(credentials: User) {
    return this.#http.post<{ success: boolean; data: string }>(
      environment.BACKEND_SERVER_URL + '/users/signup',
      credentials
    );
  }

  signin(detail: { email: string; password: string }) {
    return this.#http.post<{ success: boolean; data: string }>(
      environment.BACKEND_SERVER_URL + '/users/signin',
      detail
    );
  }
  is_logged_in() {
    return this.state$()._id ? true : false;
  }

  
}
