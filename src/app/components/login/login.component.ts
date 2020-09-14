import { Component, OnInit} from '@angular/core';
import {  UsuarioModel  } from '../../models/usuario.model';
import { AuthOdooService } from '../../services/auth-odoo.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;

  alerta  = false;
  disabled = false;

  constructor(private authOdoo: AuthOdooService, private router: Router) {
    this.usuario = new UsuarioModel();
   }

  ngOnInit(): void {
  }

  submit(): void  {
    console.log(this.usuario);
    this.authOdoo.login(this.usuario.username , this.usuario.password);

   /* setTimeout(()=>{
      if(this._authOdoo.isConnected()){
        this.router.navigate(['/dashboard', 3]);
        console.log("done");
      }
      else{
        this.disabled = true;
        this.alerta=true;
        setTimeout(()=>{this.alerta=false;this.disabled = false;},5000);
      }
    },2000);*/
  }
}
