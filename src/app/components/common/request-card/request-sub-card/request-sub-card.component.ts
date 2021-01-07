import { _isNumberValue } from '@angular/cdk/coercion';
import { AfterViewInit, Component, Input, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from '../../../../models/task.model';
import { Observable, Subscription } from 'rxjs';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { getDataUrlFromFile } from 'browser-image-compression';

@Component({
  selector: 'app-request-sub-card',
  templateUrl: './request-sub-card.component.html',
  styleUrls: ['./request-sub-card.component.scss']
})
export class RequestSubCardComponent implements OnInit, AfterViewInit {

  @Input() mode: boolean;
  @Input() role: string;
  @Input() taskSub: TaskModel;
  @Input() offersList: TaskModel[];
  currentOffer: TaskModel;

  temp: any;


  displayModal = false;

  userType: string = "";
  user: UsuarioModel;


  workforce: number;
  materials: number;
  notificationSendOffertOk$ = new Observable<number>();
  subscriptioSendOffertOk: Subscription;

  images: any[];


  constructor(private router: Router,
    public sanitizer: DomSanitizer,
    private _taskOdoo: TaskOdooService,
    private _authOdoo: AuthOdooService,
    private ngZone: NgZone) {



  }
  ngAfterViewInit(): void {
    if (this.role == 'provider') {
      var pTabNav = document.getElementsByClassName("p-tabview-nav")[0];
      var childrenLi = pTabNav.children[1];
      childrenLi.setAttribute("style", "pointer-events:none");
    }


  }

  goToChat(id) {
    this.router.navigate(['/chat/', id]);
  }

  ngOnInit() {

    // console.log(this.taskSub.photoNewTaskArrayThumb[0]);
    this.images = [];
    console.log(this.taskSub.photoNewTaskArrayThumb[0], "subcard");
    this.images.push({ source: this.taskSub.photoNewTaskArray[0], thumbnail: this.taskSub.photoNewTaskArrayThumb[0] });
    /*   for (let photo of this.taskSub.photoNewTaskArray) {
  
        this.images.push({ source: photo, thumbnail: this.resizedataURL(this.taskSub.photoNewTaskArray[0], 50, 50) });
  
  
      } */

    //console.log(this.taskSub.photoNewTaskArray[0], "sin achicar");

    //this.resizedataURL(this.taskSub.photoNewTaskArray[0], 50, 50);


    // this.images.push({ source: 'assets/showcase/images/demo/sopranos/sopranos2.jpg', thumbnail: 'assets/showcase/images/demo/sopranos/sopranos2_small.jpg', title: 'Sopranos 2' });





    if (this.role == "provider") {

      this.notificationSendOffertOk$ = this._taskOdoo.getnotificationSendOffertOk$();
      this.subscriptioSendOffertOk = this.notificationSendOffertOk$.subscribe(PoId => {

        this.ngZone.run(() => {
          if (this.taskSub.id === PoId) {

            console.log("presupuesto enviado correctamente")
            ///quitar spinner////
          }
        });
      });

    }

    this.offersList.forEach(element => {
      element.ranking = 3;
    })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    if (this.role == "provider") {
      this.subscriptioSendOffertOk.unsubscribe();
    }

  }





  sendPresupuesto() {
    //poner Spinner// inhabilitar el boton de enviar
    this.taskSub.budget = this.workforce;
    this._taskOdoo.sendOffer(this.taskSub);

  }

  public getSafeImage(url: string) {

    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

  acceptOffer(offerId) {
    alert("Accept Method ")
  }
  cancelOffer(offerId) {
    alert("Cancel Method ")
  }
  public disableEnviar: boolean = true;
  public workForceInvalid: boolean = false;
  public materialInvalid: boolean = false;
  public ceroInvalid: boolean = false;

  onKeyUpWorkForce() {
    if (!_isNumberValue(this.workforce) || this.workforce == 0) {
      this.workForceInvalid = true;
      this.disableEnviar = true;
    }
    else {

      this.workForceInvalid = false;
      //this.disableEnviar = false;
    }
  }

  onKeyUpMaterial() {
    if (!_isNumberValue(this.materials) || this.materials == 0) {
      this.materialInvalid = true;
      this.disableEnviar = true;
    }
    else {

      this.materialInvalid = false;
      //this.disableEnviar = false;
    }
  }

  onClickOffer(offer: any) {
    this.currentOffer = null;
    this.displayModal = !this.displayModal;
    this.currentOffer = offer;

  }


  resizedataURL(datas, wantedWidth, wantedHeight) {
    var img = document.createElement('img');
    img.src = datas
    img.onload = (() => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.width = wantedWidth;
      canvas.height = wantedHeight;
      ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);
      this.taskSub.photoNewTaskArrayThumb[0] = canvas.toDataURL();
      console.log(this.taskSub.photoNewTaskArrayThumb[0], "function");
    });

  }


}