import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-provider',
  templateUrl: './sign-up-provider.component.html',
  styleUrls: ['./sign-up-provider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpProviderComponent implements OnInit {

  items: MenuItem[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [{
      label: 'DATOS PROVEEDOR',
      routerLink: ''
    },
    {
      label: 'DATOS PERSONA',
      routerLink: 'person'
    },
    {
      label: 'DATOS BANCARIOS',
      routerLink: 'bank'
    },
    {
      label: 'CONFIRMACION',
      routerLink: 'confirmation'
    }
    ];
  }

  gotoCustomer(){
    this.router.navigate(['/signup/customer'])
  }

}
