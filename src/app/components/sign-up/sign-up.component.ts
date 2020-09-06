import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  usuario:UsuarioModel

  constructor() {
    this.usuario = new UsuarioModel();
   }

  ngOnInit(): void {
  }

  submit(){
    
  }

}
