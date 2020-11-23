import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { SignUpOdooService } from '../../services/signup-odoo.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  usuario:UsuarioModel

  constructor(private _signupOdoo:SignUpOdooService) {
    this.usuario = new UsuarioModel();
   }

  ngOnInit(): void {
  }

  submit(){
    console.log(this.usuario);


  }

}
