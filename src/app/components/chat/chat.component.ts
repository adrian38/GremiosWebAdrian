import { Component, NgZone, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { MessageModel } from 'src/app/models/message.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { Observable } from 'rxjs'
import { UsuarioModel } from '../../models/usuario.model';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  purchaseOrderID: number;

  task: TaskModel;
  task$: Observable<TaskModel>;
  message: MessageModel;
  messagesList: MessageModel[];
  messagesList$: Observable<MessageModel[]>;
  user: UsuarioModel
  usuario$: Observable<UsuarioModel>

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

    setInterval(() => {
    this._chatOdoo.requestAllMessages(this.purchaseOrderID);
    }, 3000);

  }

  ngOnInit(): void {
    this.messagesList$ = this._chatOdoo.getAllMessages$();
    this.messagesList$.subscribe(messagesList => {
      this.ngZone.run(() => {
        console.log(messagesList, "mensajes recibidos");

        let temp = (messagesList.find(element => element.offer_id));
        if (temp) {
          if (this.purchaseOrderID === temp.offer_id) {
            this.messagesList = messagesList;
          }
        }
      });
    });

    this.task$ = this._taskOdoo.getRequestedTask$();
    this.task$.subscribe(task => {
      this.ngZone.run(() => {

        if (task.id === this.purchaseOrderID)
          this.task = task;
      });
    });
  }

  sendMessage() {
    this.message.offer_id = this.purchaseOrderID;
    this._chatOdoo.sendMessageClient(this.message);
    this.message = new MessageModel();
  }

  acceptProvider() {
    this._taskOdoo.acceptProvider(this.purchaseOrderID,this.task.id);
    this.router.navigate(['/dashboard']);
  }

  declineProvider() {
    this._taskOdoo.declineProvider(this.purchaseOrderID);
    this.router.navigate(['/dashboard']);

  }

  updateTask() {

  }

}
