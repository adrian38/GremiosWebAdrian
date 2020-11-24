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
  //myVar;

  
  notificationSuplier:boolean;
  notificationSuplier$: Observable<boolean>;

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

  //this.initInterval();

  //this.myVar = setInterval(() => {
    //this._taskOdoo.notificationPull();
    //console.log("1");
  //  }, 60000); 

//clearInterval(this.myVar);
}



  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

   
   // clearInterval(this.myVar);
    
  }


  observablesSubscriptions() {

    if (this.usuario.type == "provider") {
 this.notificationSuplier$ = this._taskOdoo.getRequestedNotificationSuplier$();
 this.notificationSuplier$.subscribe((notificationSuplier:boolean)=>
 {
  this.ngZone.run(() => {
    this.notificationSuplier = notificationSuplier;
    console.log(this.notificationSuplier,"llego la notificacion");
  });
 });
}

    this.tab$ = this._taskOdoo.getSelectedTab$();
    this.tab$.subscribe((tab: String) => {
      this.ngZone.run(() => {
      this.tab = tab;
    });
    });

    this.tasksList$ = this._taskOdoo.getRequestedTaskList$();
    this.tasksList$.subscribe((tasksList: TaskModel[]) => {
      this.ngZone.run(() => {
          let temp:TaskModel[];
        temp = tasksList.filter(task => {        
          if (this.usuario.type === "client") {
            return task.state === 'to invoice'; //Solicitadas
          } else if (this.usuario.type === "provider") { return task.state === 'no' };
        });
                 
        if(this.solicitudesList){
          Array.prototype.push.apply(this.solicitudesList, temp);
        }else{ this.solicitudesList = temp;}
      
        temp = tasksList.filter(task => {
          return task.state === 'invoiced'; //Contratadas
        });
        if(this.contratadosList){
          Array.prototype.push.apply(this.contratadosList, temp);
        }else{ this.contratadosList = temp;}

        
         temp = tasksList.filter(task => {
          return task.state === ''; //Historial
        });
        if(this.historialList){
          Array.prototype.push.apply(this.historialList, temp);
        }else{ this.historialList = temp;}

        console.log(this.solicitudesList);
      });
    });
  }

}
