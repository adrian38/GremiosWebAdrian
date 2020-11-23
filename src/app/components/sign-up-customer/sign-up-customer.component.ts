import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-customer',
  templateUrl: './sign-up-customer.component.html',
  styleUrls: ['./sign-up-customer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpCustomerComponent implements OnInit {

  signupForm: FormGroup;

  connected$: Observable<boolean>;

  usuario:UsuarioModel;
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

  constructor(private fb:FormBuilder, private router: Router) {
   }

  ngOnInit() {
    this.createForms();
    this.isLoading =false;

  }

  createForms(){
    this.signupForm = this.fb.group({
      nombre: ['',[ Validators.required]],
      usuario: ['',[ Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      date: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  signup(){

  }

  gotoWorker(){
    this.router.navigate(['/signup-provider'])
  }
  goHome(){
    this.router.navigate(['/home'])
  }
}
