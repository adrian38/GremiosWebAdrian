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
	tab1_active: string = '';
	tab2_active: string = '';
	tab3_active: string = '';
	tab4_active: string = '';

	services = [
		{
			name: 'Fontaneria'
		}
		/* {
      name: 'Electricidad'
    } */
	];

	filtro = [
		{
			name: 'Cercania'
		},
		{
			name: 'Fecha'
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

		this.tab1_active = '';
		this.tab2_active = '_active';
		this.tab3_active = '_active';
		this.tab4_active = '_active';
		//this._taskOdoo.setSelectedTab(this.selectedTab);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
	}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.tabActive = params.tab;
			console.log(params, 'this.tabActive');

			if (params.tab) {
				switch (this.tabActive) {
					case 'request':
						this.tab1_active = '';
						this.tab2_active = '_active';
						this.tab3_active = '_active';
						break;
					case 'hired':
						this.tab1_active = '_active';
						this.tab2_active = '';
						this.tab3_active = '_active';

						break;
					case 'history':
						this.tab1_active = '_active';
						this.tab2_active = '_active';
						this.tab3_active = '';
						break;
				}
			} else {
				this.tab1_active = '_active';
				//this.tab2_active = '_active';
				//this.tab3_active = '_active';
			}
		});
	}

	emitRequest() {
		this.router.navigate([ '/new-request' ], { queryParams: { service: this.selectedService.name } });
		this.selectedService = null;
	}

	change(tab: string) {
		switch (tab) {
			case 'request':
				this.tab1_active = '';
				this.tab2_active = '_active';
				this.tab3_active = '_active';
				break;
			case 'hired':
				this.tab1_active = '_active';
				this.tab2_active = '';
				this.tab3_active = '_active';
				break;
			case 'history':
				this.tab1_active = '_active';
				this.tab2_active = '_active';
				this.tab3_active = '';
				break;
			case 'perfil':
				//this.tab4_active = '_active';
				break;
		}
	}
}
