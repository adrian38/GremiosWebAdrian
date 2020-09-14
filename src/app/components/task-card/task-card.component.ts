import { Component, OnInit, Input } from '@angular/core';
import { TaskModel } from '../../models/task.model'
import { from } from 'rxjs';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() task: TaskModel;

  constructor() { }

  ngOnInit(): void {
  }

  details (task: TaskModel){

  }

}
