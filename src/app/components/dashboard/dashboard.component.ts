import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import {AuthOdooService} from 'src/app/services/auth-odoo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario:UsuarioModel;
  usuario$: Observable<UsuarioModel>;
  task:TaskModel;
  solicitudesList:TaskModel[];
  contratadosList:TaskModel[];
  historialList:TaskModel[];
  tasksList$:Observable<TaskModel[]>;
  tab:String;
  tab$:Observable<String>;

  constructor(private _taskOdoo:TaskOdooService,
              private _authOdoo:AuthOdooService) {

    this.usuario=this._authOdoo.getUser();
    this.tab = 'Solicitudes';
    this.observablesSubscriptions();
    //this._taskOdoo.notificationPullProvider();
    
    
    if(this.usuario.type == "client"){
        this._taskOdoo.requestTaskListClient();
    }else if(this.usuario.type == "provider"){
      this._taskOdoo.requestTaskListProvider();
    }
  }

  ngOnInit(): void {
  }

  observablesSubscriptions(){
    this.tab$ = this._taskOdoo.getSelectedTab$();
    this.tab$.subscribe((tab:String)=>{
      this.tab = tab;
    });

    this.tasksList$ = this._taskOdoo.getRequestedTaskList$();
    this.tasksList$.subscribe((tasksList:TaskModel[]) =>{  
      this.solicitudesList = tasksList.filter(task=>{
        return task.state === 'to invoice'; //Solicitadas
      });
      this.contratadosList = tasksList.filter(task=>{
        return task.state === 'invoiced'; //Contratadas
      });
      this.historialList = tasksList.filter(task=>{
        return task.state === ''; //Historial
      });
      console.log(this.solicitudesList);
    });
  }
  
}
