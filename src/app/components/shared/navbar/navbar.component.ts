import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  task:TaskModel;
  user: UsuarioModel = new UsuarioModel();

  constructor(private _authOdoo:AuthOdooService, private _taskOdoo:TaskOdooService) {
    setInterval(()=>{
      this.user=this._authOdoo.getUser();
    },2000)

    this.task = new TaskModel();
    this.task.client_id = 44 //sustituir por el id de usuario
   }

  ngOnInit(): void {
  }
  
  userConnected(){
    return this._authOdoo.isConnected();
  }

  userConnected(){
    return this.user.connected;
  }

  solicitudes(){

  }
  contratados(){

  }
  terminados(){

  }

  newService (service:string){
      this.task.type = service;   
  }

  createNewService(){    
    this._taskOdoo.newTask(this.task);
    this.task = new TaskModel();
  }
}