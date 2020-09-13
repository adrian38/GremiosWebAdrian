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
  uid: number;
  isAuth: boolean;
  
  constructor(private authOdoo: AuthOdooService, private router: Router) {
    this.usuario = new UsuarioModel();
   }

  ngOnInit(): void {
  }

  submit(): void  {
    this.authOdoo.login(this.usuario.username , this.usuario.password);
    setTimeout(() => this.isAuth = (this.authOdoo.isConnected()), 2000);
    setTimeout(() => this.runDash(), 3000);
  }
  runDash(): void
  {
    if (this.isAuth === true)
    {
      this.alerta = false;
      this.uid = this.authOdoo.sendUid();
      this.router.navigateByUrl('dashboard/' + this.uid);
    }
    else{
      this.alerta = true;
    }
  }






}
