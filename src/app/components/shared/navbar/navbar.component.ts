import { Component, OnInit } from '@angular/core';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { Observable } from 'rxjs';
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
        calle: ['', Validators.required],
        numero: ['', Validators.required],
        portal: ['', Validators.required],
        escalera: ['', Validators.required],
        piso: ['', Validators.required],
        puerta: ['', Validators.required],
        cp: ['', Validators.required]
      }),
      materials: ['', [Validators.required]],
    });
  }
  
  userConnected(){
    return this.user.connected;
  }

  solicitudes(){

  }
  contratados(){

  }
  terminados(){

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
    console.log(this.photos.controls);
    
    /* this.task.client_id = this.user.partner_id;
    this._taskOdoo.newTask(this.task);
    this.task = new TaskModel(); */
  }

  loadPhoto(i:number){
    console.log(this.newServiceForm.get('photos'));
    this.newServiceForm.get('photos').value[i] = '../../../../assets/img/logoNavbar.png'
  }
}