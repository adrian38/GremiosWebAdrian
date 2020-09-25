import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot,CanActivate} from '@angular/router';
import { AuthOdooService } from '../services/auth-odoo.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _authOdoo:AuthOdooService, private route:Router) { }
  canActivate(next: ActivatedRouteSnapshot, state:RouterStateSnapshot){
      if(this._authOdoo.isConnected()){
        return true;
      }else{
        console.error("Guard!!!PleaseLogin")
        this.route.navigateByUrl("/home");
        return false
      }
    }

}
