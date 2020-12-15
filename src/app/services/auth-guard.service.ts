import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot,CanActivate} from '@angular/router';
import { AuthOdooService } from '../services/auth-odoo.service';
import { UsuarioModel } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  user : UsuarioModel = new UsuarioModel();
  constructor(private _authOdoo:AuthOdooService, private route:Router) { }
  canActivate(next: ActivatedRouteSnapshot, state:RouterStateSnapshot){
    this.user = this._authOdoo.getUser();
      if(this.user.connected == true){
        return true;
      }else{
        console.error("Guard!!!PleaseLogin")
        this.route.navigateByUrl("/home");
        return false
      }
    }

}
