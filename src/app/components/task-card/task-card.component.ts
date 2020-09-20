import { Component, OnInit, Input } from '@angular/core';
import { TaskModel } from '../../models/task.model'
import { Router } from '@angular/router';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() task: TaskModel;
  @Input() fecha: string="";
  @Input() tipo: string="";
  @Input() desc: string="";
  @Input() name: string="";
  showOffers:boolean = false;
  offersList:any;
  userType:string="";


  constructor(private router:Router,
              private _taskOdoo:TaskOdooService,
              private _authOdoo:AuthOdooService) {
    
    this.userType = this._authOdoo.userType
   }

  ngOnInit(): void {
  }

  offers(){
    this.showOffers=!this.showOffers;
    this._taskOdoo.requestProvidersForTask(this.name);
    setTimeout(() => {
      this.offersList = this._taskOdoo.getOffers();
      console.log(this.offersList);
    }, 1000);
    
    
  }

  details (task: TaskModel){

  }

  openChat(id){    
    this.router.navigate(['/chat', id]);
  }

  acceptProvider(id){
    this._taskOdoo.acceptProvider(id);
    
  }

  declineProvider(id){
    this._taskOdoo.declineProvider(id);
  }

}
