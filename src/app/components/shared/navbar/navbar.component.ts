import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from '../../../services/auth-odoo.service';
import { TaskOdooService } from '../../../services/task-odoo.service';
import { TaskModel } from '../../../models/task.model';
import { UsuarioModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  servicio:string="";
  descripcion:string="";
  task:TaskModel;
  userType:string="";
  user: UsuarioModel = new UsuarioModel();

  constructor(private _authOdoo:AuthOdooService, private _taskOdoo:TaskOdooService) {
    setInterval(()=>{
      this.user=this._authOdoo.getUser();
    },2000)

   }

  ngOnInit(): void {
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
      this.servicio = service;
  }

  createNewService(){
    this._taskOdoo.newTask(this.descripcion, this.servicio);
    this.descripcion = "";
  }
}
