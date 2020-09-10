import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskModel } from 'src/app/models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario:UsuarioModel;
  task:TaskModel;
  tasksList:TaskModel[];

  constructor() {
    this.task = new TaskModel();
    let task1 = new TaskModel("Fish Problem", "Necesito que maten al hombre-pescado", "assets/img/aquaman.png","Plomería",false);
    let task2 = new TaskModel("Blind Grandpa", "Busco quien cuide a mi primo ciego", "assets/img/daredevil.png","Electricidad",false)
    let task3 = new TaskModel("Coronavirus Vaccine", "Se busca investigador para vacuna contra coronavirus", "assets/img/batman.png","Plomería",false)
    this.tasksList = [];
    this.tasksList.push(task1, task2, task3);
   }

  ngOnInit(): void {
  }

  newTask(){
    console.log(this.task);
    this.tasksList.push(this.task);
    
  }

}
