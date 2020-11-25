import { Component, NgZone, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario: UsuarioModel;
  usuario$: Observable<UsuarioModel>;
  task: TaskModel;

  solicitudesList: TaskModel[];
  contratadosList: TaskModel[];

  historialList: TaskModel[];
  tasksList$: Observable<TaskModel[]>; // servicio comunicacion

  tab: String;
  tab$: Observable<String>;
  

  notificationNewPoSuplier: number[];
  notificationNewPoSuplier$: Observable<number[]>;

  notificationSoCancelled$: Observable<number>;

  notificationPoCancelled$: Observable<number[]>;

  notificationNewSoClient$: Observable<boolean>;

  notificationError$: Observable<boolean>;

  inicio = true;

  constructor(private _taskOdoo: TaskOdooService,
    private _authOdoo: AuthOdooService,
    private ngZone: NgZone) {

    this.usuario = this._authOdoo.getUser();

    this.observablesSubscriptions();
    this.tab = 'Solicitudes';


    if (this.usuario.type == "client") {
      this._taskOdoo.requestTaskListClient();


    } else if (this.usuario.type == "provider") {
      this._taskOdoo.requestTaskListProvider();

    }

  }

  ngOnInit(): void {

 
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }


  observablesSubscriptions() {

    ////////////////////////////////Para el Cliente

    if (this.usuario.type == "client") {


      this.notificationNewSoClient$ = this._taskOdoo.getNotificationNewSoClient$();
      this.notificationNewSoClient$.subscribe(notificationNewSoClient => {
        this.ngZone.run(() => {

          if (notificationNewSoClient) {
            console.log("Se creo correctamente la tarea");
          }

        });

      });

      this.notificationSoCancelled$ = this._taskOdoo.getNotificationSoCancelled$();
      this.notificationSoCancelled$.subscribe(notificationSoCancelled => {
        this.ngZone.run(() => {

          let temp = (this.solicitudesList.findIndex(element => element.id === notificationSoCancelled));
          this.solicitudesList.splice(temp, 1);
        });

      });
    }

    ////////////////////////////////Para el proveedor

    if (this.usuario.type == "provider") {

     
      this.notificationPoCancelled$ = this._taskOdoo.getRequestedNotificationPoCancelled$();
      this.notificationPoCancelled$.subscribe(notificationPoCancelled => {
        this.ngZone.run(() => {
          for (let Po_id of notificationPoCancelled){
          console.log("PO Cancelled por notificacion");
          let temp = (this.solicitudesList.findIndex(element => element.id === Po_id ));
          this.solicitudesList.splice(temp, 1);
          }
        });

      });
    
      this.notificationNewPoSuplier$ = this._taskOdoo.getRequestedNotificationNewPoSuplier$();
      this.notificationNewPoSuplier$.subscribe((notificationNewPoSuplier: number[]) => {
        this.ngZone.run(() => {

         for (let Po_id of notificationNewPoSuplier){

            let temp = (this.solicitudesList.findIndex(element => element.id === Po_id ));
            if (temp !== -1){
              console.log(temp,"temp");
              notificationNewPoSuplier.splice(temp,1);
            }
          } 
               
          //console.log(this.notificationNewPoSuplier, "llego la notificacion");
          this._taskOdoo.requestTaskPoUpdate(notificationNewPoSuplier);
       
        });
      });
    }

    //////////////////Para Todos

    this.notificationError$ = this._taskOdoo.getNotificationError$();
    this.notificationError$.subscribe(notificationError =>{
      this.ngZone.run(()=>{

        if(notificationError){
        console.log("Error!!!!!!!!!!!");
        }
      });

    });


    this.tab$ = this._taskOdoo.getSelectedTab$();
    this.tab$.subscribe((tab: String) => {
      this.ngZone.run(() => {
        this.tab = tab;
      });
    });

    this.tasksList$ = this._taskOdoo.getRequestedTaskList$();
    this.tasksList$.subscribe((tasksList: TaskModel[]) => {
      this.ngZone.run(() => {
        let temp: TaskModel[];
        temp = tasksList.filter(task => {
          if (this.usuario.type === "client") {
            return task.state === 'to invoice'; //Solicitadas
          } else if (this.usuario.type === "provider") { return task.state === 'no' };
        });

        if (this.solicitudesList) {
          Array.prototype.push.apply(this.solicitudesList, temp);
        } else { this.solicitudesList = temp; }

        temp = tasksList.filter(task => {
          return task.state === 'invoiced'; //Contratadas
        });
        if (this.contratadosList) {
          Array.prototype.push.apply(this.contratadosList, temp);
        } else { this.contratadosList = temp; }


        temp = tasksList.filter(task => {
          return task.state === ''; //Historial
        });
        if (this.historialList) {
          Array.prototype.push.apply(this.historialList, temp);
        } else { this.historialList = temp; }

        console.log(this.solicitudesList);
      });
      if (this.inicio){
        this.inicio = false;
        this._taskOdoo.notificationPull();
      }
    });
  }

}
