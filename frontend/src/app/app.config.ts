import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import {provideToastr} from 'ngx-toastr'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.route';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokenInterceptor } from './auth/add-token.interceptor';
import { AuthService } from './auth/auth.service';

const bootStrap = ()=>{
  const auth = inject(AuthService)
  return ()=>{
    const persisted_state = localStorage.getItem('finalProject');
    if(persisted_state){
      auth.state$.set(JSON.parse(persisted_state))
    } 
  }
}
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    provideToastr(),
    {provide:APP_INITIALIZER, multi:true, useFactory:bootStrap}
  ]
};
