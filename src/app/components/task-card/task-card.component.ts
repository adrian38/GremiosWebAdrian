import { Component, OnInit, Input } from '@angular/core';
import { TaskModel } from '../../models/task.model'
import { Router } from '@angular/router';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { UsuarioModel} from '../../models/usuario.model'

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() task: any;
  @Input() fecha: string="";
  @Input() tipo: string="";
  @Input() desc: string="";
  @Input() name: string="";
  showOffers:boolean = false;
  sendOffer:boolean= false;
  offersList:any;
  presupuesto:number;
  userType:string="";
  user : UsuarioModel;

  offersList:TaskModel[];
  offersList$: Observable<TaskModel[]>;

  showOffers:boolean = false;
  sendOffer:boolean= false;
  
  constructor(private router:Router,
              private _taskOdoo:TaskOdooService,
              private _authOdoo:AuthOdooService) {
    
    this.offersList =[];
    this.user = this._authOdoo.getUser();
    this.userType = this.user.type
   }

  ngOnInit(): void {
    this.offersList$ = this._taskOdoo.getOffers$();
    this.offersList$.subscribe(offersList =>{
      this.offersList= offersList;
      //console.log(this.offersList);      
    })
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
    //console.log(this.presupuesto);
    this._taskOdoo.sendOffer(offer);
  }
}
