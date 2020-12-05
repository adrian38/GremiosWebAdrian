import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';

@Component({
  selector: 'app-sign-up-customer',
  templateUrl: './sign-up-customer.component.html',
  styleUrls: ['./sign-up-customer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpCustomerComponent implements OnInit {

  signupForm: FormGroup;

  connected$: Observable<boolean>;

  usuario:UsuarioModel = new UsuarioModel;
  
  usuario$:Observable<UsuarioModel>

  alerta:boolean=false;
  disabled=false;
  connected:boolean;

  isLoading = true;

  get nombreNoValido(){
    return this.signupForm.get('nombre').invalid && this.signupForm.get('nombre').touched;
  }
  get usuarioNoValido(){
    return this.signupForm.get('usuario').invalid && this.signupForm.get('usuario').touched;
  }

  get addressNoValido(){
    return this.signupForm.get('address').invalid && this.signupForm.get('address').touched;
  }

  get phoneNoValido(){
    return this.signupForm.get('phone').invalid && this.signupForm.get('phone').touched;
  }

  get passwordNoValido(){
    return this.signupForm.get('password').invalid && this.signupForm.get('password').touched;
  }

  notificationOK$: Observable<boolean>;
  notificationError$: Observable<boolean>;

  constructor(private fb:FormBuilder,
     private router: Router,
     private _signupOdoo: SignUpOdooService,
     private ngZone: NgZone) {
   }

  ngOnInit() {
    this.createForms();
    this.isLoading =false;

    this.notificationError$ = this._signupOdoo.getNotificationError$();
      this.notificationError$.subscribe(notificationError =>{
      this.ngZone.run(()=>{

        if(notificationError){
          console.log("Error creando Usuario");
        }
      });

    });

    this.notificationOK$ = this._signupOdoo.getNotificationOK$();
      this.notificationOK$.subscribe(notificationOK => {
        this.ngZone.run(() => {

          if (notificationOK) {
            
            console.log("Usuario Creado");
          }

        });

      });

  }

  createForms(){
    this.signupForm = this.fb.group({
      nombre: ['',[ Validators.required]],
      usuario: ['',[ Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      date: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]/////Cambiar por todos los demas campos
    });
  }

  signup(){

    /* if (this.signupForm.invalid) {
      return Object.values(this.signupForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        }
        control.markAsTouched();
      })
    } */

    this.usuario.realname = this.signupForm.value['nombre'];
    this.usuario.username = this.signupForm.value['usuario'];
    this.usuario.password = this.signupForm.value['password'];
    this.usuario.date = this.signupForm.value['date'];
    this.usuario.phone = this.signupForm.value['phone'];
    this.usuario.type = 'client';
    
        
    this._signupOdoo.newUser(this.usuario);
    this.createForms();
    this.usuario = new UsuarioModel; 
    

  }

  gotoWorker(){
    this.router.navigate(['/signup/provider'])
  }
  goHome(){
    this.router.navigate(['/home'])
  }
}
