import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { Address, TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { Observable, Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  task:TaskModel;
  user: UsuarioModel = new UsuarioModel();
  user$: Observable<UsuarioModel>;

  selectedTab:String;
  
  newServiceForm: FormGroup;

  get tituloNoValido(){
    return this.newServiceForm.get('title').invalid && this.newServiceForm.get('title').touched;
  }
  get materialsNoValido(){
    return this.newServiceForm.get('materials').invalid && this.newServiceForm.get('materials').touched;
  }

  get photos(){
    return this.newServiceForm.get('photos') as FormArray;
  }

  constructor(private fb:FormBuilder,
              private _authOdoo:AuthOdooService,
              private _taskOdoo:TaskOdooService) {
    this.task = new TaskModel();
    this.selectedTab = 'Solicitudes';
    this._taskOdoo.setSelectedTab(this.selectedTab);
    this.createForm();
   }

  ngOnInit(): void {
    this.user$ = this._authOdoo.getUser$();
    this.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
  }

  createForm(){
    this.newServiceForm = this.fb.group({
      title: ['', [Validators.required]],
      date: [''],
      time: [''],
      description: [''],
      photos: this.fb.array([
        ['../../../../assets/img/noImage.png'],
        ['../../../../assets/img/noImage.png'],
        ['../../../../assets/img/noImage.png']
      ]),
      address: this.fb.group({
        calle: ['' ],
        numero: ['' ],
        portal: [''],
        escalera: [''],
        piso: [''],
        puerta: [''],
        cp: ['']
      }),
      materials: ['', [Validators.required]],
    });
  }
  
  userConnected(){
    return this.user.connected;
  }

  changeTab(tab:String){
    this.selectedTab = tab;
    this._taskOdoo.setSelectedTab(this.selectedTab);
  }

  newService (service:string){
      this.task.type = service;  
  }

  createNewService(){
    if (this.newServiceForm.invalid) {
      return Object.values(this.newServiceForm.controls).forEach(control=>{
        if(control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched());
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
    //this.newServiceForm.reset();
    this.task = new TaskModel();
  }

  loadPhoto(i:number){
    console.log(this.newServiceForm.get('photos'));
    this.newServiceForm.get('photos').value[i] = '../../../../assets/img/logoNavbar.png'
  }
}