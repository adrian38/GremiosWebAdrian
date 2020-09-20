import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from 'src/app/models/task.model';

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

  constructor(private _authOdoo:AuthOdooService, private _taskOdoo:TaskOdooService) {
    setInterval(()=>{
      this.userType=this._authOdoo.userType;
    },2000)
    
   }

  ngOnInit(): void {
  }
  
  userConnected(){
    return this._authOdoo.isConnected();
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