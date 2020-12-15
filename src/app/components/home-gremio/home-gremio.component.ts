import { Component, ViewEncapsulation, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { UsuarioModel } from 'src/app/models/usuario.model';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';

import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { LoginComponent } from './login/login.component';
declare const $: any;

@Component({
  selector: 'app-home-gremio',
  templateUrl: './home-gremio.component.html',
  styleUrls: ['./home-gremio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeGremioComponent {


  imgCarousel = ['assets/img/home1.jpg', 'assets/img/home3.jpg'];

  loginForm: FormGroup;


  usuario: UsuarioModel;


  alerta: boolean = false;
  disabled = false;
  connected: boolean;

  get usuarioNoValido() {
    return this.loginForm.get('usuario').invalid && this.loginForm.get('usuario').touched;
  }

  get passwordNoValido() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched;
  }

  @ViewChild(PlaceHolderDirective, { static: false }) loginHost: PlaceHolderDirective;

  constructor(private fb: FormBuilder,
    private _authOdoo: AuthOdooService,


    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    this.usuario = new UsuarioModel;
    this.createForms();
  }



  createForms() {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {

    this.usuario.username = this.loginForm.get('usuario').value
    this.usuario.password = this.loginForm.get('password').value
    this._authOdoo.login(this.usuario);
    this.disabled = true;

  }


  openSignUpModal() {
    document.getElementById('close-loginModal').click();
  }

  showLoginDialog() {
    const loginCompFactory = this.componentFactoryResolver.resolveComponentFactory(LoginComponent);

    const hostViewContainerRef = this.loginHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(loginCompFactory);


  }
}
