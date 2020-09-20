import { Component, OnInit} from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { MessageModel } from 'src/app/models/message.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  purchaseOrderID:number;

  task:any;
  message:string="";
  messagesList:any;
  desc:string="";
  fecha:string="";
  hora:string="";
  providerName:string="";
  costo:number=0;
  userType:string="";

  constructor(private _authOdoo:AuthOdooService,
              private _taskOdoo:TaskOdooService,
              private _chatOdoo:ChatOdooService,
              private router:Router,
              private activatedRoute:ActivatedRoute) {

    this.userType=this._authOdoo.userType;
    
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
      if(this._authOdoo.userType =="client"){
        this.providerName = this.task['partner_id'][1];
      }else if(this._authOdoo.userType =="provider"){
        this.providerName = this.task['user_id'][1];
      }
      console.log(this.task);
      
      console.log(this.desc);
      
    },3000);
    
    
    
    setInterval(()=>{

      this._chatOdoo.requestAllMessages(this.purchaseOrderID);

      setTimeout(()=>{
        this.messagesList=this._chatOdoo.getAllMessages();
        
      },1500);
    }, 3000);
    
   }

  ngOnInit(): void {  
  }

  sendMessage(){
    if(this._authOdoo.userType =="client"){
      this._chatOdoo.sendMessageClient(this.message, Number(this.purchaseOrderID));
    }else if(this._authOdoo.userType =="provider"){
      this._chatOdoo.sendMessageProvider(this.message, Number(this.purchaseOrderID));
    }     
    this.message="";
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
