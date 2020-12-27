import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard-gremio',
  templateUrl: './dashboard-gremio.component.html',
  styleUrls: ['./dashboard-gremio.component.scss']
})
export class DashboardGremioComponent implements OnInit {

  activateTab: string;
  isLoading: boolean;

  usuario: UsuarioModel;
  task: TaskModel;
  solicitudesList: TaskModel[];
  contratadosList: TaskModel[];
  historialList: TaskModel[];
  tab: String;


  tasksList$: Observable<TaskModel[]>; // servicio comunicacion
  tab$: Observable<String>;
  notificationNewPoSuplier$: Observable<number[]>;
  notificationSoCancelled$: Observable<number>;
  notificationPoCancelled$: Observable<number[]>;
  notificationNewSoClient$: Observable<boolean>;
  notificationError$: Observable<boolean>;
  notificationOffertCancelled$: Observable<number[]>;
  notificationPoAcepted$: Observable<any[]>;
  offersList$: Observable<TaskModel[]>;
  notificationSendOffertOk$ = new Observable<number>();


  subscriptioNewPoSuplier: Subscription;
  subscriptioSoCancelled: Subscription;
  subscriptioPoCancelled: Subscription;
  subscriptioNewSoClient: Subscription;
  subscriptionError: Subscription;
  subscriptionOffertCancelled: Subscription;
  subscriptionPoAcepted: Subscription;
  subscriptionTab: Subscription;
  subscriptiontasksList: Subscription;
  subscriptionOffersList: Subscription;
  subscriptioSendOffertOk: Subscription;


  constructor(private route: ActivatedRoute,
    private _taskOdoo: TaskOdooService,
    private _authOdoo: AuthOdooService,
    private ngZone: NgZone,
    private router: Router,
    private messageService: MessageService,) {

    this.isLoading = true;

    this.usuario = this._authOdoo.getUser();

    this.tab = 'Solicitudes';




    if (this.usuario.type == "client") {
      this._taskOdoo.requestTaskListClient();
      console.log("es un cliente");


    } else if (this.usuario.type == "provider") {
      this._taskOdoo.requestTaskListProvider();

    }

  }

  pagosComponent() {
    this.router.navigate(['/payment'])
  }

  ngOnInit(): void {



    this.route.queryParams.subscribe(params => {
      this.activateTab = params.tab;
    });

    this.observablesSubscriptions();

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    if (this.usuario.type == "client") {
      this.subscriptioSoCancelled.unsubscribe();
      this.subscriptioNewSoClient.unsubscribe();
      this.subscriptionOffersList.unsubscribe();
    }

    if (this.usuario.type == "provider") {

      this.subscriptioPoCancelled.unsubscribe();
      this.subscriptioNewPoSuplier.unsubscribe();
      this.subscriptionOffertCancelled.unsubscribe();
      this.subscriptionPoAcepted.unsubscribe();
      this.subscriptioSendOffertOk.unsubscribe();


    }

    this.subscriptionError.unsubscribe();
    this.subscriptionTab.unsubscribe();
    this.subscriptiontasksList.unsubscribe();


  }
  observablesSubscriptions() {

    ////////////////////////////////Para el Cliente

    if (this.usuario.type == "client") {


      this.offersList$ = this._taskOdoo.getOffers$();
      this.subscriptionOffersList = this.offersList$.subscribe(offersList => {

        this.ngZone.run(() => {

          if (offersList[0].budget === 0) {
            this.messageService.add({ severity: 'error', summary: 'Disculpe', detail: 'Todavia no hay ofertas.' });
          }
        });
      });


      this.notificationNewSoClient$ = this._taskOdoo.getNotificationNewSoClient$();
      this.subscriptioNewSoClient = this.notificationNewSoClient$.subscribe(notificationNewSoClient => {
        this.ngZone.run(() => {

          if (notificationNewSoClient) {
            console.log("Se creo correctamente la tarea");
          }

        });

      });

      this.notificationSoCancelled$ = this._taskOdoo.getNotificationSoCancelled$();
      this.subscriptioSoCancelled = this.notificationSoCancelled$.subscribe(notificationSoCancelled => {
        this.ngZone.run(() => {

          let temp = (this.solicitudesList.findIndex(element => element.id === notificationSoCancelled));
          if (temp !== -1) {
            this.solicitudesList.splice(temp, 1);
          }
        });

      });
    }

    ////////////////////////////////Para el proveedor

    if (this.usuario.type == "provider") {

      this.notificationSendOffertOk$ = this._taskOdoo.getnotificationSendOffertOk$();
      this.subscriptioSendOffertOk = this.notificationSendOffertOk$.subscribe(PoId => {

        this.ngZone.run(() => {

          console.log("entre a send dashboard")

          this.messageService.add({ severity: 'success', summary: 'Completado', detail: 'Se envio correctamenta la oferta.' });
          let temp = this.solicitudesList.findIndex(element => element.id === PoId)
          if (temp !== -1) {
            this.solicitudesList[temp].offer_send = "sent";

          }

          console.log(this.solicitudesList);
        });
      });


      this.notificationPoCancelled$ = this._taskOdoo.getRequestedNotificationPoCancelled$();
      this.subscriptioPoCancelled = this.notificationPoCancelled$.subscribe(notificationPoCancelled => {
        this.ngZone.run(() => {
          for (let Po_id of notificationPoCancelled) {
            console.log("PO Cancelled por notificacion");
            let temp = (this.solicitudesList.findIndex(element => element.id === Po_id));
            if (temp !== -1) {
              this.solicitudesList.splice(temp, 1);
            }
          }
        });

      });

      this.notificationNewPoSuplier$ = this._taskOdoo.getRequestedNotificationNewPoSuplier$();
      this.subscriptioNewPoSuplier = this.notificationNewPoSuplier$.subscribe((notificationNewPoSuplier: number[]) => {
        this.ngZone.run(() => {

          if (typeof this.solicitudesList) {
            for (let Po_id of notificationNewPoSuplier) {


              let temp = (this.solicitudesList.findIndex(element => element.id === Po_id));
              if (temp !== -1) {
                notificationNewPoSuplier.splice(temp, 1);
              }
            }
            this._taskOdoo.requestTaskPoUpdate(notificationNewPoSuplier);
          }
        });
      });

      this.notificationOffertCancelled$ = this._taskOdoo.getRequestedNotificationOffertCancelled$();
      this.subscriptionOffertCancelled = this.notificationOffertCancelled$.subscribe(notificationOffertCancelled => {
        this.ngZone.run(() => {

          for (let Po_id of notificationOffertCancelled) {
            console.log("PO Cancelled por notificacionOffert");
            let temp = (this.solicitudesList.findIndex(element => element.id === Po_id));
            if (temp !== -1) {
              this.solicitudesList.splice(temp, 1);
            }
          }

        });

      });

      this.notificationPoAcepted$ = this._taskOdoo.getRequestedNotificationPoAcepted$();
      this.subscriptionPoAcepted = this.notificationPoAcepted$.subscribe(notificationPoAcepted => {
        this.ngZone.run(() => {

          console.log(notificationPoAcepted, "notificacionaceptada");
          /*         for (let Po_id of notificationPoAcepted){
                    console.log("PO Cancelled por notificacionOffert");
                    let temp = (this.solicitudesList.findIndex(element => element.id === Po_id ));
                    if(temp !== -1){
                    this.solicitudesList.splice(temp, 1);
                    }
                    } */

        });

      });

    }

    //////////////////Para Todos

    this.notificationError$ = this._taskOdoo.getNotificationError$();
    this.subscriptionError = this.notificationError$.subscribe(notificationError => {
      this.ngZone.run(() => {

        if (notificationError) {
          console.log("Error!!!!!!!!!!!");
        }
      });

    });


    this.tab$ = this._taskOdoo.getSelectedTab$();
    this.subscriptionTab = this.tab$.subscribe((tab: String) => {
      this.ngZone.run(() => {
        this.tab = tab;
      });
    });

    this.tasksList$ = this._taskOdoo.getRequestedTaskList$();
    this.subscriptiontasksList = this.tasksList$.subscribe((tasksList: TaskModel[]) => {
      this.ngZone.run(() => {
        let temp: TaskModel[];
        temp = tasksList.filter(task => {
          if (this.usuario.type === "client") {
            return task.state === 'to invoice'; //Solicitadas
          } else if (this.usuario.type === "provider") { return task.state === 'no' };
        });

        if (typeof this.solicitudesList !== 'undefined' && this.solicitudesList.length > 0) {
          Array.prototype.push.apply(this.solicitudesList, temp);
        } else { this.solicitudesList = temp; }

        temp = tasksList.filter(task => {
          return task.state === 'invoiced'; //Contratadas
        });
        if (typeof this.contratadosList !== 'undefined' && this.contratadosList.length > 0) {
          Array.prototype.push.apply(this.contratadosList, temp);
        } else { this.contratadosList = temp; }


        temp = tasksList.filter(task => {
          return task.state === ''; //Historial
        });
        if (typeof this.historialList !== 'undefined' && this.historialList.length > 0) {
          Array.prototype.push.apply(this.historialList, temp);
        } else { this.historialList = temp; }

        //  console.log(this.solicitudesList);
        this.isLoading = false;
      });



    });
  }




}
