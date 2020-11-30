import { Component, OnInit, Input, NgZone } from '@angular/core';
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
  showDetails:boolean = false;
  showDescription:boolean=false;
  showDate:boolean=true;
  showAddress:boolean=false;

  userType:string="";
  user : UsuarioModel;

  offersList:TaskModel[];
  offersList$: Observable<TaskModel[]>;


  constructor(private router:Router,
              private _taskOdoo:TaskOdooService,
              private _authOdoo:AuthOdooService,
              private ngZone: NgZone) {

    this.user = this._authOdoo.getUser();
    this.offersList =[];
    this.userType = this.user.type
   }

  ngOnInit(): void {

    /////////////////////////////////////////////////////
    this.offersList$ = this._taskOdoo.getOffers$();
    this.offersList$.subscribe(offersList =>{

      this.ngZone.run( () => {

        if(offersList.find(element=>element.origin))
        {
        let temp = (offersList.find(element=>element.origin));

        if(this.task.id_string === temp.origin)
        {
          this.offersList= offersList;
          this.showOffers = true;
        }
      }
      });
    });
  }

  offers(){
    if(this.showOffers){
      this.showOffers = false;
    }
      else
      this._taskOdoo.requestOffersForTask(this.task.id_string);
  }

  ////Hacer en el HTML
  selectTypeCancel(){
    if (this.userType === "client" ){
      this.cancelSOclient()
    }else if(this.userType === "provider"){
      this.cancelPOsuplier();
    }
  }
  //////////////////////
  cancelSOclient(){
    console.log("CancelarSo");
    this._taskOdoo.cancelSOclient(this.task.id);
  }

  cancelPOsuplier(){
    console.log("CancelarPo");
    this._taskOdoo.cancelPOsuplier(this.task.id);
  }

  details(){
    this.showOffers = false;
    this.showDetails = !this.showDetails;
  }

  navDetails (nav: string){
    switch(nav){
      case 'description':
        this.showAddress = false;
        this.showDate = false;
        this.showDescription = true;
        break;
      case 'date':
        this.showAddress = false;
        this.showDate = true;
        this.showDescription = false;
        break;
      default:
        this.showAddress = true;
        this.showDate = false;
        this.showDescription = false;
    }
  }

  openChat(id){
    this.router.navigate(['/chat', id]);
  }

  acceptProvider(PO_id){
    let SO_id = this.task.id;
    this._taskOdoo.acceptProvider(PO_id, SO_id);

  }

  declineProvider(id){
    this._taskOdoo.declineProvider(id);
  }

  sendPresupuesto(offer:TaskModel){
    this._taskOdoo.sendOffer(offer);
  }
}
