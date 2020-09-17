import { Component, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { MessageModel } from 'src/app/models/message.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  task:TaskModel;
  message:string="";
  messagesList:any;

  constructor(private _taskOdoo:TaskOdooService,
              private _chatOdoo:ChatOdooService,
              private router:Router) {

    setInterval(()=>{

      this._chatOdoo.requestAllMessages(84);

      setTimeout(()=>{
        this.messagesList=this._chatOdoo.getAllMessages();
        console.log(this.messagesList[0].author_id);
      },1500);
    }, 3000);
    
   }

  ngOnInit(): void {  
  }

  sendMessage(){
    console.log(this.message);
    this._chatOdoo.sendMessageClient(this.message);
    this.message="";
  }

  acceptProvider(){
    this._taskOdoo.acceptProvider(84);
    this.router.navigate(['/dashboard', 3]);
  }

  declineProvider(){
    this._taskOdoo.declineProvider(84);
    this.router.navigate(['/dashboard', 3]);
    
  }

  updateTask(){
    
  }

}
