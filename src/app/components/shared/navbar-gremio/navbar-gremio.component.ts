import { Component, OnInit, HostListener, ViewEncapsulation, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
declare const $: any;

@Component({
  selector: 'app-navbar-gremio',
  templateUrl: './navbar-gremio.component.html',
  styleUrls: ['./navbar-gremio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarGremioComponent implements OnInit {

  task: TaskModel;
  user: UsuarioModel = new UsuarioModel();
  user$: Observable<UsuarioModel>;

  selectedService: any;
  selectedTab: String;
  tabActive: string;

  services = [
    {
      name: 'Fontaneria'
    },
    {
      name: 'Electricidad'
    }
  ];
  constructor(private router: Router,
    private fb: FormBuilder,
    private _authOdoo: AuthOdooService,
    private route: ActivatedRoute,
    private _taskOdoo: TaskOdooService, private ngZone: NgZone) {

    this.task = new TaskModel();
    this.selectedTab = 'Solicitudes';
    this._taskOdoo.setSelectedTab(this.selectedTab);

  }

  ngOnInit() {
    this.user$ = this._authOdoo.getUser$();
    this.user$.subscribe(user => {
      this.ngZone.run(() => {
        this.user = user;
        console.log(this.user);
      });

    });
    this.route.queryParams.subscribe(params => {
      this.tabActive = params.tab;
    })
  }

  userConnected() {
    return this.user.connected;
    // return true;
  }

  emitRequest() {

    this.router.navigate(['/new-request'], { queryParams: { service: this.selectedService.name } })
    this.selectedService = null;
  }
}
