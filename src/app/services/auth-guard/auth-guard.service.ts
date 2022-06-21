import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn:'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router ) { }

  canActivate(){
    try{
    const token =localStorage.getItem('auth')?JSON.parse(atob(localStorage.getItem('auth'))).jwtToken:null;

    if(token){
      return true
    }else{
      this.router.navigate(['auth'])
      return false
    }
  }catch(error){
    localStorage.removeItem('auth')
    this.router.navigate(['auth'])
    return false
}
}
}
