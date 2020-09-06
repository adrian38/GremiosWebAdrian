import { Component, OnInit} from '@angular/core';
import {UsuarioModel} from '../../models/usuario.model'
import { OdooService } from 'src/app/services/auth-odoo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel;
  alerta:boolean=false;
  disabled=false;

  constructor(private _odoo:OdooService) {
    this.usuario = new UsuarioModel;
   }

  ngOnInit(): void {
  }

  submit(){
    this._odoo.login(this.usuario)
    
    setTimeout(()=>{
      if(this._odoo.isConnected()){
        console.log("done");
      }
      else{
        this.disabled = true;
        this.alerta=true;
        setTimeout(()=>{this.alerta=false;this.disabled = false;},5000);
      }
    },750);
  }
}
