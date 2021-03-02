import { Component, ComponentFactoryResolver, Input, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
	selector: 'app-hire-sub-card',
	templateUrl: './hire-sub-card.component.html',
	styleUrls: [ './hire-sub-card.component.scss' ]
})
export class HireSubCardComponent implements OnInit {
	@Input() mode: boolean;
	@Input() role: string;
	@Input() taskSub: TaskModel;

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
		private ngZone: NgZone,
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	ngOnInit() {
		this.images = [];
		if (this.taskSub.photoNewTaskArray.length > 0) {
			this.numberPhoto = this.taskSub.photoNewTaskArray.length.toString() + '+';
			this.taskSub.photoNewTaskArray.forEach((element) => {
				this.images.push({ previewImageSrc: element });
			});
		}
	}

	public getSafeImage(url: string) {
		return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
	}

	onClickMap() {
		this.lat = parseFloat(this.taskSub.address.latitude);
		this.lng = parseFloat(this.taskSub.address.longitude);
		this.zoom = 15;
		this.displayModalMap = !this.displayModalMap;
	}

	imageClick(index: number) {
		this.activeIndex = index;
		this.displayBasic2 = true;
	}
}
