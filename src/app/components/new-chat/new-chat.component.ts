import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MessageModel } from 'src/app/models/message.model';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent implements OnInit {

  purchaseOrderID: number;

  subscriptionMessList: Subscription;
  subscriptionNewMsg: Subscription;
  subscriptionNotification: Subscription;
  subscriptionTask: Subscription;


  task: TaskModel;
  task$: Observable<TaskModel[]>;
  message: MessageModel;
  messagesList: MessageModel[];
  messagesList$: Observable<MessageModel[]>;
  messageSendOk$: Observable<MessageModel>;
  user: UsuarioModel
  usuario$: Observable<UsuarioModel>
  notificationNewMessg$: Observable<number[]>;


  constructor(private _authOdoo: AuthOdooService,
    private _taskOdoo: TaskOdooService,
    private _chatOdoo: ChatOdooService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone) {


    this.task = new TaskModel();
    this.user = this._authOdoo.getUser();
    this.message = new MessageModel();
    this.messagesList = [];

    this.activatedRoute.params.subscribe(params => {
      this.purchaseOrderID = Number(params['id']);
      console.log(this.purchaseOrderID);
    })

    this._taskOdoo.requestTask(this.purchaseOrderID);
    this._chatOdoo.requestAllMessages(this.purchaseOrderID);


  }

  ngOnInit(): void {

    this.messageSendOk$ = this._chatOdoo.getRequestedNotificationSendMessage$();
    this.subscriptionNewMsg = this.messageSendOk$.subscribe(messageSendOk => {
      this.ngZone.run(() => {
        console.log("mande mensaje");
        if (messageSendOk.offer_id === this.purchaseOrderID) {
          messageSendOk.author = this.user.realname;
          messageSendOk.author_id = this.user.partner_id;
          console.log(messageSendOk);
          this.messagesList.push(messageSendOk);
        }

      });

    });

    this.notificationNewMessg$ = this._taskOdoo.getRequestedNotificationNewMessg$();
    this.subscriptionNotification = this.subscriptionNotification = this.notificationNewMessg$.subscribe(notificationNewMessg => {

      this.ngZone.run(() => {
        console.log(notificationNewMessg, "idMessage");
        this._chatOdoo.requestNewMessage(notificationNewMessg);
      });

    });

    this.messagesList$ = this._chatOdoo.getAllMessages$();
    this.subscriptionMessList = this.messagesList$.subscribe(messagesList => {
      this.ngZone.run(() => {
        console.log("recibi todo los mensajes");
        let temp = (messagesList.find(element => element.offer_id));
        if (temp) {

          if (this.purchaseOrderID === temp.offer_id) {
            if (typeof this.messagesList !== 'undefined' && this.messagesList.length > 0) {
              Array.prototype.push.apply(this.messagesList, messagesList);
            } else { this.messagesList = messagesList; console.log(this.messagesList); }
          }
        }
      });
    });

    this.task$ = this._taskOdoo.getRequestedTask$();
    this.subscriptionTask = this.task$.subscribe(task => {
      console.log("Obtuve la tarea");
      this.ngZone.run(() => {
        let temp = (task.find(element => element.id));
        if (this.purchaseOrderID === temp.id)
          this.task = temp;
      });
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptionMessList.unsubscribe();
    this.subscriptionNewMsg.unsubscribe();
    this.subscriptionNotification.unsubscribe();
    this.subscriptionTask.unsubscribe();
  }

  sendMessage() {
    if (this.message.message.length) {
      this.message.offer_id = this.purchaseOrderID;
      this._chatOdoo.sendMessageClient(this.message);
      this.message = new MessageModel();
    }
  }

  acceptProvider() {
    this._taskOdoo.acceptProvider(this.purchaseOrderID, this.task.id);
    this.router.navigate(['/dashboard']);
  }

  declineProvider() {
    this._taskOdoo.declineProvider(this.purchaseOrderID);
    this.router.navigate(['/dashboard']);

  }

  updateTask() {

  }

}
