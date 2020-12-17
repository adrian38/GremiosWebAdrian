import { Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { UsuarioModel } from '../../../models/usuario.model'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestCardComponent implements OnInit {

  showSubCard = false;
  offersDetail = false;
  user: UsuarioModel;
  userType: string = "";
  offersList: TaskModel[];
  offersList$: Observable<TaskModel[]>;
  isLoading = false;



  notificationOffertCancelled$: Observable<number[]>;
  notificationNewOffertSuplier$: Observable<any[]>;

  subscriptionOffersList: Subscription;
  subscriptionOffertCancelled: Subscription;
  subscriptionNewOffertSuplier: Subscription;

  @Input() task: TaskModel;
  @Input() role: 'client' | 'provider';


  constructor(private _taskOdoo: TaskOdooService,
    private _authOdoo: AuthOdooService,
    private ngZone: NgZone) {

    this.user = this._authOdoo.getUser();
    this.offersList = [];
    this.userType = this.user.type;

  }


  ngOnInit() {
    if (this.userType === 'client') {

      this.notificationOffertCancelled$ = this._taskOdoo.getRequestedNotificationOffertCancelled$();
      this.subscriptionOffertCancelled = this.notificationOffertCancelled$.subscribe(notificationOffertCancelled => {
        this.ngZone.run(() => {


          if (typeof this.offersList !== 'undefined' && this.offersList.length > 0) {
            for (let Po_id of notificationOffertCancelled) {

              let temp = this.offersList.findIndex(element => element.id === Po_id);
              if (temp !== -1) {
                this.offersList.splice(temp, 1);
              }

            }

          }
        });

      });

      this.notificationNewOffertSuplier$ = this._taskOdoo.getRequestedNotificationNewOffertSuplier$();
      this.subscriptionNewOffertSuplier = this.notificationNewOffertSuplier$.subscribe(notificationNewOffertSuplier => {

        this.ngZone.run(() => {

          if (notificationNewOffertSuplier.findIndex(element => element.origin === this.task.id_string) !== -1) {

            console.log("tengo una nueva solicitud");

          }

        });
      });

      /////////////////////////////////////////////////////
      this.offersList$ = this._taskOdoo.getOffers$();
      this.subscriptionOffersList = this.offersList$.subscribe(offersList => {

        this.ngZone.run(() => {
          if ((offersList.findIndex(element => element.origin === this.task.id_string) !== -1)) {
            if (offersList[0].budget !== 0) {
              this.offersList = offersList;
              this.isLoading = false;
              this.showSubCard = true;
            }
            else {
              this.isLoading = false;
              console.log("No tienes Ofertas");
            }
          }
        });
      });
    }

    console.log(this.task);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.userType === 'client') {

      this.subscriptionOffersList.unsubscribe();
      this.subscriptionOffertCancelled.unsubscribe();
      this.subscriptionNewOffertSuplier.unsubscribe();

    }

  }

  selectTypeCancel() {
    if (this.userType === "client") {
      this.cancelSOclient()
    } else if (this.userType === "provider") {
      this.cancelPOsuplier();
    }
  };

  cancelSOclient() {
    console.log("CancelarSo");
    this._taskOdoo.cancelSOclient(this.task.id);
  }

  cancelPOsuplier() {
    console.log("CancelarPo");
    this._taskOdoo.cancelPOsuplier(this.task.id);
  }


  onShowSubCard(offerDetail: boolean) {
    if (this.showSubCard) {
      this.showSubCard = false;
    } else {
      this.isLoading = true;
      this._taskOdoo.requestOffersForTask(this.task.id_string);
    }
  }
}
