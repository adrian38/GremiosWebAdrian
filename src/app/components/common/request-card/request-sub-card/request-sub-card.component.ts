import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from '../../../../models/task.model';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-request-sub-card',
	templateUrl: './request-sub-card.component.html',
	styleUrls: [ './request-sub-card.component.scss' ]
})
export class RequestSubCardComponent implements OnInit {
	@Input() mode: boolean;
	@Input() role: string;
	@Input() taskSub: TaskModel;
	@Input() offersList: TaskModel[];

	lat = 19.29095;
	lng = -99.653015;
	zoom = 9;

	currentOffer: TaskModel;

	temp: any;

	images: any[];
	activeIndex;
	displayBasic2;

	numberPhoto: string;
	displayModalWorker = false;
	displayModalMap = false;

	userType: string = '';
	user: UsuarioModel;
	total: number = 0;
	tempMaterial: number = 0;
	tempHandWork: number = 0;

	workforce: number;
	materials: number;
	notificationSendOffertOk$ = new Observable<number>();
	subscriptioSendOffertOk: Subscription;

	constructor(
		private router: Router,
		public sanitizer: DomSanitizer,
		private _taskOdoo: TaskOdooService,
		private _authOdoo: AuthOdooService,
		private ngZone: NgZone
	) {}

	goToChat(id) {
		this.router.navigate([ '/chat/', id ]);
	}

	ngOnInit() {
		this.images = [];
		if (this.taskSub.photoNewTaskArray.length > 0) {
			this.numberPhoto = this.taskSub.photoNewTaskArray.length.toString() + '+';
			this.taskSub.photoNewTaskArray.forEach((element) => {
				this.images.push({ previewImageSrc: element });
			});
		}

		if (this.role == 'provider') {
			this.notificationSendOffertOk$ = this._taskOdoo.getnotificationSendOffertOk$();
			this.subscriptioSendOffertOk = this.notificationSendOffertOk$.subscribe((PoId) => {
				this.ngZone.run(() => {
					if (this.taskSub.id === PoId) {
						console.log('presupuesto enviado correctamente');
						///quitar spinner////
					}
				});
			});
		}

		this.offersList.forEach((element) => {
			element.ranking = 3;
		});
	}

	imageClick(index: number) {
		this.activeIndex = index;
		this.displayBasic2 = true;
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.

		if (this.role == 'provider') {
			this.subscriptioSendOffertOk.unsubscribe();
		}
	}

	sendPresupuesto() {
		//poner Spinner// inhabilitar el boton de enviar
		this.taskSub.budget = this.workforce;
		this._taskOdoo.sendOffer(this.taskSub);
	}

	public getSafeImage(url: string) {
		return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
	}

	acceptOffer(offerId) {
		alert('Accept Method ');
	}
	cancelOffer(offerId) {
		alert('Cancel Method ');
	}
	public disableEnviarM: boolean = true;
	public disableEnviarW: boolean = true;
	public workForceInvalid: boolean = false;
	public materialInvalid: boolean = false;
	public ceroInvalid: boolean = false;

	onKeyUpWorkForce() {
		if (!_isNumberValue(this.workforce) || this.workforce == 0) {
			if (this.total != 0) {
				this.total = this.total - this.tempHandWork;
				this.tempHandWork = 0;
			}
			this.workForceInvalid = true;
			this.disableEnviarW = true;
		} else {
			if (this.taskSub.require_materials) {
				this.disableEnviarM = false;
				this.total = this.workforce;
				this.tempHandWork = this.workforce;
				this.workForceInvalid = false;
				this.disableEnviarW = false;
			} else if (!this.disableEnviarM) {
				this.total = this.total + this.workforce - this.tempHandWork;
				this.tempHandWork = this.workforce;
				this.workForceInvalid = false;
				this.disableEnviarW = false;
			} else {
				this.total = this.workforce;
				this.tempHandWork = this.workforce;
				this.workForceInvalid = false;
				this.disableEnviarW = false;
			}
		}
	}

	onKeyUpMaterial() {
		if (!_isNumberValue(this.materials) || this.materials == 0) {
			if (this.total != 0) {
				this.total = this.total - this.tempMaterial;
				this.tempMaterial = 0;
			}
			this.materialInvalid = true;
			this.disableEnviarM = true;
		} else {
			console.log(this.materials);

			if (!this.disableEnviarW) {
				this.total = this.total + this.materials - this.tempMaterial;
				this.tempMaterial = this.materials;
				this.materialInvalid = false;
				this.disableEnviarM = false;
			} else {
				this.total = this.materials;
				this.tempMaterial = this.materials;
				this.materialInvalid = false;
				this.disableEnviarM = false;
			}
		}
	}

	edtiName(name: string) {
		let temp = name.split(' ');
		return temp[0] + ' ' + temp[1].slice(0, 1) + '.';
	}

	onClickOffer(offer: TaskModel) {
		this.currentOffer = null;
		this.currentOffer = offer;
		console.log(this.currentOffer, 'carnet');
		this.displayModalWorker = !this.displayModalWorker;
	}

	onClickMap() {
		this.lat = parseFloat(this.taskSub.address.latitude);
		this.lng = parseFloat(this.taskSub.address.longitude);
		this.zoom = 15;
		this.displayModalMap = !this.displayModalMap;
	}
}
