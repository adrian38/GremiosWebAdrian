import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Address, TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';

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
  task: any;
  user: UsuarioModel = new UsuarioModel();
  user$: Observable<UsuarioModel>;
  base64textString = null;


  selectedTab: String;
  isLoading: boolean;
  loadImage: boolean[] = [false,false,false];
  urlImage = 'data:type/example;base64,';

  imageSizeLimit: number = 12000000;
  imageSizeLimitKb = Math.round(this.imageSizeLimit / 1000);
  errorMessageImage: string = 'La imagen sobrepasa los ';
  imageArticle = ['','',''];
  currentIndex: number;

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
    private messageService: MessageService,
    public sanitizer: DomSanitizer,
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
            this.messageService.add({severity:'success', summary: 'Completado', detail: 'Se creo correctamente la tarea.'});

          }

        });

      });

      this.notificationError$ = this._taskOdoo.getNotificationError$();
    this.notificationError$.subscribe(notificationError =>{
      this.ngZone.run(()=>{

        if(notificationError){
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error creando tarea.'});
        }
      });

    });


  }

  createForm() {
    this.newServiceForm = this.fb.group({
      title: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
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
    this.isLoading = true;

     if (this.newServiceForm.invalid) {
      return Object.values(this.newServiceForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        }
        control.markAsTouched();
      })
    } 
    // document.getElementById('close-newService-modal').click();

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
    console.log(this.task.date);
    this._taskOdoo.newTask(this.task);
    this.isLoading = false;
    // this.messageService.add({severity:'success', summary: 'Completado', detail: 'Se creo correctamente la tarea.'});

    this.createForm();
    this.task = new TaskModel();
  }

  openFileBrowser(event,index) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker'+index) as HTMLElement;
    element.click();
  }

  handleFileSelect(evt,index) {
    this.currentIndex =index;
    const files = evt.target.files;
    const file = files[0];
    ///data:type/example;base64,
    this.urlImage = `data:${file.type};base64,`;
    if (files[0].size < this.imageSizeLimit) {
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.messageService.add({severity:'error', summary: 'Error', detail: this.errorMessageImage + this.imageSizeLimitKb + 'kB'});

    }
  }

  async handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.imageArticle[this.currentIndex] = this.urlImage + this.base64textString;
    try {
      this.loadImage[this.currentIndex] = true;
      // this.imageArticleChange = true;
    } catch (error) {
      this.loadImage[this.currentIndex] = true;
      // this.imageArticleChange = true;
    }
  }

  public getSafeImage(url: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

}
