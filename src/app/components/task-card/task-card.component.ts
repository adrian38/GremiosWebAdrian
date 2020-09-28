import { Component, OnInit, Input } from '@angular/core';
import { TaskModel } from '../../models/task.model'
import { Router } from '@angular/router';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { UsuarioModel} from '../../models/usuario.model'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() task: TaskModel;

  showOffers:boolean = false;
  sendOffer:boolean= false;

  userType:string="";
  user : UsuarioModel;

  offersList:TaskModel[];
  offersList$: Observable<TaskModel[]>;

  
  constructor(private router:Router,
              private _taskOdoo:TaskOdooService,
              private _authOdoo:AuthOdooService) {
    
    this.user = this._authOdoo.getUser();
    this.offersList =[];
    this.userType = this.user.type
   }

  ngOnInit(): void {
    this.offersList$ = this._taskOdoo.getOffers$();
    this.offersList$.subscribe(offersList =>{
      this.offersList= offersList;
      //console.log(this.offersList);      
    });
  }

  offers(){
    this.showOffers=!this.showOffers;
    this._taskOdoo.requestOffersForTask(this.task.id_string);   
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

  sendPresupuesto(offer:TaskModel){
    this._taskOdoo.sendOffer(offer);
  }
}
