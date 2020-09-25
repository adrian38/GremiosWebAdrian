import { Component, OnInit} from '@angular/core';
import { TaskModel } from '../../models/task.model';
import { MessageModel } from '../../models/message.model';
import { TaskOdooService } from '../../services/task-odoo.service';
import { ChatOdooService } from '../../services/chat-odoo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthOdooService } from '../../services/auth-odoo.service';
import {Observable} from 'rxjs'
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  purchaseOrderID:number;

  task:any;
  message:MessageModel;
  messagesList:MessageModel[];
  messagesList$: Observable<MessageModel[]>;
  desc:string="";
  fecha:string="";
  hora:string="";
  providerName:string="";
  costo:number=0;
  userType:string="";
  user : UsuarioModel

  constructor(private _authOdoo:AuthOdooService,
              private _taskOdoo:TaskOdooService,
              private _chatOdoo:ChatOdooService,
              private router:Router,
              private activatedRoute:ActivatedRoute) {

    this.message = new MessageModel();
    this.messagesList = [];
    this.user = this._authOdoo.getUser()
    this.userType=this.user.type;

    this.activatedRoute.params.subscribe(params =>{
      this.purchaseOrderID = Number(params['id']);
    })

    this._taskOdoo.requestTask(this.purchaseOrderID);

    setTimeout(()=>{
      this.task = this._taskOdoo.getRequestedTask()[0];
      this.desc = this._taskOdoo.getRequestedTask()[1]['note'];
      this.fecha = this.task.date_order.slice(0,10);
      this.hora = this.task.date_order.slice(11,this.task.date_order.lenght);
      this.costo = this.task.amount_total;
      if(this.user.type =="client"){
        this.providerName = this.task['partner_id'][1];
      }else if(this.user.type =="provider"){
        this.providerName = this.task['user_id'][1];
      }
      console.log(this.task);

      console.log(this.desc);

    },3000);



    setInterval(()=>{
      this._chatOdoo.requestAllMessages(this.purchaseOrderID);
    }, 3000);

   }

  ngOnInit(): void {
    this.messagesList$ = this._chatOdoo.getAllMessages$();
    this.messagesList$.subscribe(messagesList => {
      this.messagesList = messagesList;
    });
  }

  sendMessage(){
    this.message.offer_id = this.purchaseOrderID;
    this._chatOdoo.sendMessageClient(this.message);
    this.message= new MessageModel();
  }

  acceptProvider(){
    this._taskOdoo.acceptProvider(this.purchaseOrderID);
    this.router.navigate(['/dashboard', 3]);
  }

  declineProvider(){
    this._taskOdoo.declineProvider(this.purchaseOrderID);
    this.router.navigate(['/dashboard', 3]);

  }

  updateTask(){

  }

}
