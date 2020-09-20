import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario:UsuarioModel;
  
  alerta:boolean=false;
  disabled=false;

  constructor(private _authOdoo:AuthOdooService,
              private router:Router, 
              private _taskOdoo:TaskOdooService,
              private _chatOdoo:ChatOdooService) {
    this.usuario = new UsuarioModel;
   }

  ngOnInit(): void {
  }

  submit(){
    this._authOdoo.login(this.usuario)
    
    setTimeout(()=>{
      if(this._authOdoo.isConnected()){
        let user:any = this._authOdoo.getUser();               
        this._taskOdoo.setUser(this.usuario, user);
        this._chatOdoo.setUser(this.usuario, user);
        this.router.navigate(['/dashboard', 3]);
        console.log("done");
        document.getElementById('close-modal').click();
      }
      else{
        this.disabled = true;
        this.alerta=true;
        setTimeout(()=>{this.alerta=false;this.disabled = false;},5000);
      }
    },3000);
  }
}
