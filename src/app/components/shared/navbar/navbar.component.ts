import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  task:TaskModel;
  user: UsuarioModel = new UsuarioModel();
  user$: Observable<UsuarioModel>;

  constructor(private _authOdoo:AuthOdooService, private _taskOdoo:TaskOdooService) {

    this.task = new TaskModel();
    this.task.client_id = this.user.id
   }

  ngOnInit(): void {
    this.user$ = this._authOdoo.getUser$();
    this.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
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