import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Address, TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewRequestComponent implements OnInit {

  signupForm: FormGroup;
  serviceName: string;
  frequency: string;
  available: string;
  newServiceForm: FormGroup;
  task: TaskModel;
  user: UsuarioModel = new UsuarioModel();
  user$: Observable<UsuarioModel>;

  selectedTab: String;

  get tituloNoValido() {
    return this.newServiceForm.get('title').invalid && this.newServiceForm.get('title').touched;
  }
  get fechaNoValido() {
    return this.newServiceForm.get('date').invalid && this.newServiceForm.get('date').touched;
  }
  get horaNoValido() {
    return this.newServiceForm.get('time').invalid && this.newServiceForm.get('time').touched;
  }
  get descriptionNoValido() {
    return this.newServiceForm.get('description').invalid && this.newServiceForm.get('description').touched;
  }
  get calleNoValido() {
    return this.newServiceForm.get('address.calle').invalid && this.newServiceForm.get('address.calle').touched;
  }
  get pisoNoValido() {
    return this.newServiceForm.get('address.piso').invalid && this.newServiceForm.get('address.piso').touched;
  }
  get numeroNoValido() {
    return this.newServiceForm.get('address.numero').invalid && this.newServiceForm.get('address.numero').touched;
  }
  get puertaNoValido() {
    return this.newServiceForm.get('address.puerta').invalid && this.newServiceForm.get('address.puerta').touched;
  }
  get portalNoValido() {
    return this.newServiceForm.get('address.portal').invalid && this.newServiceForm.get('address.portal').touched;
  }
  get cpNoValido() {
    return this.newServiceForm.get('address.cp').invalid && this.newServiceForm.get('address.cp').touched;
  }
  get escaleraNoValido() {
    return this.newServiceForm.get('address.escalera').invalid && this.newServiceForm.get('address.escalera').touched;
  }
  get materialsNoValido() {
    return this.newServiceForm.get('materials').invalid && this.newServiceForm.get('materials').touched;
  }

  get photos() {
    return this.newServiceForm.get('photos') as FormArray;
  }

  notificationNewSoClient$: Observable<boolean>;
  notificationError$: Observable<boolean>;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private _taskOdoo: TaskOdooService,
    private _authGuard: AuthGuardService,
    private ngZone: NgZone) {

    this.serviceName = "Servicio de " + this.route.snapshot.queryParams.service;
    this.task = new TaskModel();
    this.task.type = this.serviceName;
    if(this.route.snapshot.queryParams.service === 'Fontaneria') {
      this.task.product_id = 39;
        }
    this.selectedTab = 'Solicitudes';
    this._taskOdoo.setSelectedTab(this.selectedTab);
    this.createForm();
  }

  ngOnInit() {

    this.notificationNewSoClient$ = this._taskOdoo.getNotificationNewSoClient$();
      this.notificationNewSoClient$.subscribe(notificationNewSoClient => {
        this.ngZone.run(() => {

          if (notificationNewSoClient) {
            console.log("Se creo correctamente la tarea");
          }

        });

      });

      this.notificationError$ = this._taskOdoo.getNotificationError$();
    this.notificationError$.subscribe(notificationError =>{
      this.ngZone.run(()=>{

        if(notificationError){
        console.log("Error!!!!!!!!!!!");
        }
      });

    });


  }

  createForm() {
    this.newServiceForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      description: ['',[Validators.required]],
      photos: this.fb.array([
        ['../../../../assets/img/noImage.png'],
        ['../../../../assets/img/noImage.png'],
        ['../../../../assets/img/noImage.png']
      ]),
      address: this.fb.group({
        calle: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        portal: ['', [Validators.required]],
        escalera: ['', [Validators.required]],
        piso: ['', [Validators.required]],
        puerta: ['', [Validators.required]],
        cp: ['', [Validators.required]]
      }),
      materials: ['', [Validators.required]],
    });
  }
  createNewService() {
    if (this.newServiceForm.invalid) {
      return Object.values(this.newServiceForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        }
        control.markAsTouched();
      })
    }
    document.getElementById('close-newService-modal').click();

    this.task.title = this.newServiceForm.value['title'];
    this.task.date = this.newServiceForm.value['date'];
    this.task.time = this.newServiceForm.value['time'];
    this.task.description = this.newServiceForm.value['description'];
    this.task.address = new Address(this.newServiceForm.value['address']['calle'],
      this.newServiceForm.value['address']['numero'],
      this.newServiceForm.value['address']['portal'],
      this.newServiceForm.value['address']['escalera'],
      this.newServiceForm.value['address']['piso'],
      this.newServiceForm.value['address']['puerta'],
      this.newServiceForm.value['address']['cp'],
      'latitude',
      'longitude');
    this.task.require_materials = Boolean(Number(this.newServiceForm.value['materials']));
    this.task.client_id = this.user.partner_id;
    console.log(this.task);
    this._taskOdoo.newTask(this.task);
    this.createForm();
    this.task = new TaskModel();
  }


}
