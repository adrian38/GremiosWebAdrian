import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import {AuthOdooService} from 'src/app/services/auth-odoo.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario:UsuarioModel;
  task:TaskModel;
  tasksList:any;
  userType:string;

  constructor(private _taskOdoo:TaskOdooService,
              private _authOdoo:AuthOdooService) {
    this.task = new TaskModel();
    this.userType = this._authOdoo.userType;

    
    setInterval(()=>{
      if(this.userType == "client"){
        this._taskOdoo.requestTaskList();
      }else if(this.userType == "provider"){
        this._taskOdoo.requestTaskListProvider();
      }
        setTimeout(() => {
          this.tasksList=this._taskOdoo.getRequestedTaskList();
          console.log(this.tasksList);  
        }, 2000);
    },5000);
  }

  ngOnInit(): void {
  }

  newTask(){
    console.log(this.task);
    this.tasksList.push(this.task);
    
  }

}
