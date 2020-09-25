import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { AuthOdooService } from '../../services/auth-odoo.service';
import { TaskOdooService } from '../../services/task-odoo.service';
import { ChatOdooService } from '../../services/chat-odoo.service';

import {Observable} from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  connected$: Observable<boolean>;

  usuario:UsuarioModel;

  alerta:boolean=false;
  disabled=false;
  connected:boolean;

  constructor(private _authOdoo:AuthOdooService,
              private router:Router,
              private _taskOdoo:TaskOdooService,
              private _chatOdoo:ChatOdooService) {
    this.usuario = new UsuarioModel;
   }

  ngOnInit(): void {
    this.connected$ = this._authOdoo.getConnected$();
    this.connected$.subscribe(connected => {
      this.connected = connected;
    });
  }

  submit(){
    this._authOdoo.login(this.usuario)
    setTimeout(()=>{
      if(this.usuario.connected){
        let user:any = this._authOdoo.getUser();
        this._taskOdoo.setUser(this.usuario);
        this._chatOdoo.setUser(this.usuario);
        console.log("MODELO USUARIO",this.usuario)
        this.router.navigate(['/dashboard']);
        console.log("done");
        document.getElementById('close-modal').click();
      }
      else{
        this.disabled = true;
        this.alerta=true;
        setTimeout(()=>{this.alerta=false;this.disabled = false;console.log(this.connected);
        },5000);
      }
    },1000);
  }
}
