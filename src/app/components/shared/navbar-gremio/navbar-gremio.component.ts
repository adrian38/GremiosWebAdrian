import { Component, OnInit, HostListener, ViewEncapsulation, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
declare const $: any;

@Component({
	selector: 'app-navbar-gremio',
	templateUrl: './navbar-gremio.component.html',
	styleUrls: [ './navbar-gremio.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NavbarGremioComponent implements OnInit {
	user: UsuarioModel = new UsuarioModel();

	selectedService: any;
	selectedTab: String;
	tabActive: string;

	services = [
		{
			name: 'Fontaneria'
		}
		/* {
      name: 'Electricidad'
    } */
	];
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private _authOdoo: AuthOdooService,
		private route: ActivatedRoute,
		private _taskOdoo: TaskOdooService,
		private ngZone: NgZone
	) {
		this.user = this._authOdoo.getUser();
		this.selectedTab = 'Solicitudes';
		this._taskOdoo.setSelectedTab(this.selectedTab);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
	}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.tabActive = params.tab;
		});
	}

	emitRequest() {
		this.router.navigate([ '/new-request' ], { queryParams: { service: this.selectedService.name } });
		this.selectedService = null;
	}
}
