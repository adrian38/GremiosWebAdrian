import { Component, OnInit, HostListener, ViewEncapsulation, ViewChild, ComponentFactoryResolver, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { LoginComponent } from './login/login.component';
declare const $:any;

@Component({
  selector: 'app-home-gremio',
  templateUrl: './home-gremio.component.html',
  styleUrls: ['./home-gremio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeGremioComponent implements OnInit {


  imgCarousel= ['assets/img/home1.jpg','assets/img/home3.jpg'];

  loginForm: FormGroup;

  connected$: Observable<boolean>;

  usuario: UsuarioModel;
  usuario$: Observable<UsuarioModel>

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
    private router: Router,
    private _taskOdoo: TaskOdooService,
    private _authGuard: AuthGuardService,
    private _chatOdoo: ChatOdooService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private ngZone: NgZone) {
    this.usuario = new UsuarioModel;
    this.createForms();
  }

  ngOnInit(): void {
    // this.usuario$ = this._authOdoo.getUser$();
    // this.usuario$.subscribe(user => {
    //   this.ngZone.run(() => {
    //     this.usuario = user;
    //     this.checkUser();
    //   });
    // });
  }

  createForms() {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    /* if(this.loginForm.invalid){
      this.disabled = true;
      this.alerta=true;
      setTimeout(()=>{this.alerta=false;this.disabled = false;console.log(this.connected);
      },5000);
      return;
    } */
    this.usuario.username = this.loginForm.get('usuario').value
    this.usuario.password = this.loginForm.get('password').value
    this._authOdoo.login(this.usuario);
    this.disabled = true;
    //this._authOdoo.loginClientApk(this.usuario);
  }

  // checkUser() {
  //   if (this.usuario.connected) {

  //     this._taskOdoo.setUser(this.usuario);
  //     this._chatOdoo.setUser(this.usuario);
  //     this.router.navigate(['/dashboard']);
  //     document.getElementById('close-loginModal').click();
  //   }
  //   else {
  //     this.disabled = true;
  //     this.alerta = true;
  //     setTimeout(() => {
  //       this.alerta = false; this.disabled = false; console.log(this.connected);
  //     }, 5000);
  //   }
  // }

  openSignUpModal() {
    document.getElementById('close-loginModal').click();
  }

  showLoginDialog() {
    const loginCompFactory = this.componentFactoryResolver.resolveComponentFactory(LoginComponent);

    const hostViewContainerRef = this.loginHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(loginCompFactory);

    // this.closeSub = componentRef.instance.close.subscribe(() => {
    //   this.closeSub.unsubscribe();
    //   hostViewContainerRef.clear();
    // })
  }
}
