import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';

import {Observable} from 'rxjs'
import { AuthGuardService } from 'src/app/services/auth-guard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  connected$: Observable<boolean>;

  usuario:UsuarioModel;
  usuario$:Observable<UsuarioModel>
  
  alerta:boolean=false;
  disabled=false;
  connected:boolean;

  constructor(private _authOdoo:AuthOdooService,
              private router:Router, 
              private _taskOdoo:TaskOdooService,
              private _authGuard:AuthGuardService,
              private _chatOdoo:ChatOdooService) {
    this.usuario = new UsuarioModel;
   }

  ngOnInit(): void {
    this.usuario$ = this._authOdoo.getUser$();
    this.usuario$.subscribe(user => {
      this.usuario = user;
      this.checkUser();
    });
  }

  checkUser(){
    if(this.usuario.connected){
      this._taskOdoo.setUser(this.usuario);
      this._chatOdoo.setUser(this.usuario);
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
  }

  submit(){
    this._authOdoo.login(this.usuario)
  }
}
