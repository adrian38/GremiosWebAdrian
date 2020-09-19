import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario:UsuarioModel;
  task:TaskModel;
  tasksList:any;

  constructor(private _taskOdoo:TaskOdooService) {
    this.task = new TaskModel();
    /* let task1 = new TaskModel("Fish Problem", "Necesito que maten al hombre-pescado", "assets/img/aquaman.png","Plomería",false);
    let task2 = new TaskModel("Blind Grandpa", "Busco quien cuide a mi abuelo ciego", "assets/img/daredevil.png","Electricidad",false)
    let task3 = new TaskModel("Coronavirus Vaccine", "Se busca investigador para vacuna contra coronavirus", "assets/img/batman.png","Plomería",false)
    this.tasksList = [];
    this.tasksList.push(task1, task2, task3); */

    this._taskOdoo.requestTaskList();
    setTimeout(() => {
      this.tasksList=this._taskOdoo.getRequestedTaskList();
      console.log(this.tasksList);  
    }, 2000);
   }

  ngOnInit(): void {
  }

  newTask(){
    console.log(this.task);
    this.tasksList.push(this.task);
    
  }

}
