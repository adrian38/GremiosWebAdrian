import { Component, Input, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from '../../../../models/task.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-request-sub-card',
  templateUrl: './request-sub-card.component.html',
  styleUrls: ['./request-sub-card.component.scss']
})
export class RequestSubCardComponent implements OnInit {

  @Input() mode: boolean;
  @Input() role: string;
  @Input() taskSub: TaskModel;
  @Input() offersList: TaskModel[];


  displayModal = false;

  userType: string = "";
  user: UsuarioModel;


  workforce: number;
  materials: number;
  notificationSendOffertOk$ = new Observable<number>();
  subscriptioSendOffertOk: Subscription;



  constructor(private router: Router,
    public sanitizer: DomSanitizer,
    private _taskOdoo: TaskOdooService,
    private _authOdoo: AuthOdooService,
    private ngZone: NgZone) {


  }

  goToChat(id) {
    this.router.navigate(['/chat/', id]);
  }

  ngOnInit() {

    if (this.role == "provider") {

      this.notificationSendOffertOk$ = this._taskOdoo.getnotificationSendOffertOk$();
      this.subscriptioSendOffertOk = this.notificationSendOffertOk$.subscribe(PoId => {

        this.ngZone.run(() => {
          /*   if ((offersList.findIndex(element => element.origin === this.task.id_string) !== -1)) {
              if (offersList[0].budget !== 0) {
                this.offersList = offersList;
                this.isLoading1 = false;
                this.isLoading2 = false;
                this.showSubCard = true;
              }
              else {
                this.isLoading1 = false;
                this.isLoading2 = false;
                console.log("No tienes Ofertas");
              }
            } */
        });
      });

    }

  }





  sendPresupuesto() {
    this.taskSub.budget = this.workforce;
    this._taskOdoo.sendOffer(this.taskSub);

  }

  public getSafeImage(url: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

}
