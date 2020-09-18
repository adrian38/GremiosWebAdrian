import { Component, OnInit, Input } from '@angular/core';
import { TaskModel } from '../../models/task.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() task: TaskModel;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  details (task: TaskModel){

  }
  openChat(task){
    this.router.navigate(['/chat', 210]);
  }

}
