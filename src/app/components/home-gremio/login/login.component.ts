import { Component, OnInit, HostListener, ViewEncapsulation, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  displayModal = true;
  connected$: Observable<boolean>;

  usuario: UsuarioModel;
  usuario$: Observable<UsuarioModel>
  subscriptionUsuario: Subscription;

  alerta: boolean = false;
  disabled = false;
  connected: boolean;

  isLoading: boolean;

  get usuarioNoValido() {
    return this.loginForm.get('usuario').invalid && this.loginForm.get('usuario').touched;
  }

  get passwordNoValido() {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched;
  }

  constructor(private fb: FormBuilder,
    private _authOdoo: AuthOdooService,
    private router: Router,
    private _taskOdoo: TaskOdooService,
    private _chatOdoo: ChatOdooService,
    private ngZone: NgZone,) {
    this.usuario = new UsuarioModel;
    this.createForms();
  }

  ngOnInit(): void {
    this.usuario$ = this._authOdoo.getUser$();
    this.subscriptionUsuario = this.usuario$.subscribe(user => {
      this.ngZone.run(() => {
        this.usuario = user;
        this.checkUser();
      });
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
    this.loginForm.reset();
    this.subscriptionUsuario.unsubscribe();

  }

  createForms() {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      //usuario: ['', [Validators.required]],
      //password: ['', [Validators.required, Validators.minLength(6)]]
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      console.log("error escribiendo usuario")
      this.disabled = true;
      this.alerta = true;
      setTimeout(() => {
        this.alerta = false; this.disabled = false; console.log(this.connected);
      }, 5000);
      return;
    }
    this.usuario.username = this.loginForm.get('usuario').value
    this.usuario.password = this.loginForm.get('password').value
    this.isLoading = true;

    this._authOdoo.login(this.usuario);
  }

  checkUser() {
    if (this.usuario.connected) {
      this._taskOdoo.setUser(this.usuario);
      this._chatOdoo.setUser(this.usuario);
      this._taskOdoo.notificationPull();
      this.isLoading = false;
      this.displayModal = false;
      this.router.navigate(['/dashboard'], { queryParams: { tab: 'request' } });

    }
    else {
      this.disabled = true;
      this.alerta = true;
      this.isLoading = false;

      setTimeout(() => {
        this.alerta = false; this.disabled = false; console.log(this.connected);
      }, 5000);
    }
  }

  openSignUpModal() {
    document.getElementById('close-loginModal').click();
  }

}
