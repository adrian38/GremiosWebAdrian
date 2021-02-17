import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Address, TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { Marcador } from 'src/app/classes/marcador.class';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-new-request',
	templateUrl: './new-request.component.html',
	styleUrls: [ './new-request.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NewRequestComponent implements OnInit {
	serviceName: string;
	frequency: string;
	available: string;
	newServiceForm: FormGroup;
	task: any;
	user: UsuarioModel = new UsuarioModel();

	mygeo: boolean = true;
	//geo: boolean = true;

	Autofill: boolean = false;

	base64textString = null;

	lat = 19.29095;
	lng = -99.653015;
	marcadores: Marcador[] = [];
	zoom = 9;
	displayModalMap = false;
	displayModalLoading = false;

	selectedTab: String;
	isLoading: boolean;
	loadImage: boolean[] = [ false, false, false ];
	urlImage = 'data:type/example;base64,';

	imageSizeLimit: number = 12000000;
	imageSizeLimitKb = Math.round(this.imageSizeLimit / 1000);
	errorMessageImage: string = 'La imagen sobrepasa los ';
	imageArticle = [ '', '', '' ];
	currentIndex: number;

	get tituloNoValido() {
		return this.newServiceForm.get('title').invalid && this.newServiceForm.get('title').touched;
	}
	get fechaNoValido() {
		return this.newServiceForm.get('date').invalid && this.newServiceForm.get('date').touched;
	}
	get horaNoValido() {
		return this.newServiceForm.get('time').invalid && this.newServiceForm.get('time').touched;
	}
	get descriptionNoValido() {
		return this.newServiceForm.get('description').invalid && this.newServiceForm.get('description').touched;
	}
	get calleNoValido() {
		return this.newServiceForm.get('address.calle').invalid && this.newServiceForm.get('address.calle').touched;
	}
	get pisoNoValido() {
		return this.newServiceForm.get('address.piso').invalid && this.newServiceForm.get('address.piso').touched;
	}
	get numeroNoValido() {
		return this.newServiceForm.get('address.numero').invalid && this.newServiceForm.get('address.numero').touched;
	}
	get puertaNoValido() {
		return this.newServiceForm.get('address.puerta').invalid && this.newServiceForm.get('address.puerta').touched;
	}
	get portalNoValido() {
		return this.newServiceForm.get('address.portal').invalid && this.newServiceForm.get('address.portal').touched;
	}
	get cpNoValido() {
		return this.newServiceForm.get('address.cp').invalid && this.newServiceForm.get('address.cp').touched;
	}
	get escaleraNoValido() {
		return (
			this.newServiceForm.get('address.escalera').invalid && this.newServiceForm.get('address.escalera').touched
		);
	}
	get materialsNoValido() {
		return this.newServiceForm.get('materials').invalid && this.newServiceForm.get('materials').touched;
	}

	get photos() {
		return this.newServiceForm.get('photos') as FormArray;
	}

	notificationNewSoClient$: Observable<boolean>;
	notificationError$: Observable<boolean>;

	subscriptioNewSoClient: Subscription;
	subscriptionError: Subscription;

	headerString: string = ' ';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private _taskOdoo: TaskOdooService,
		private _authGuard: AuthGuardService,
		private _authOdoo: AuthOdooService,
		private messageService: MessageService,
		public sanitizer: DomSanitizer,
		private ngZone: NgZone,
		private date: DatePipe
	) {
		this.user = this._authOdoo.getUser();
		this.serviceName = 'Servicio de ' + this.route.snapshot.queryParams.service;
		this.task = new TaskModel();
		this.task.type = this.serviceName;
		if (this.route.snapshot.queryParams.service === 'Fontaneria') {
			this.task.product_id = 39;
		}
		this.selectedTab = 'Solicitudes';
		this._taskOdoo.setSelectedTab(this.selectedTab);
		this.createForm();
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.

		this.subscriptioNewSoClient.unsubscribe();
		this.subscriptionError.unsubscribe();
	}

	ngOnInit() {
		this.notificationNewSoClient$ = this._taskOdoo.getNotificationNewSoClient$();
		this.subscriptioNewSoClient = this.notificationNewSoClient$.subscribe((notificationNewSoClient) => {
			this.ngZone.run(() => {
				if (notificationNewSoClient) {
					this.mygeo = false;
					this.displayModalLoading = false;
					console.log('Se creo correctamente la tarea');
					this.messageService.add({
						severity: 'success',
						summary: 'Completado',
						detail: 'Se creo correctamente la tarea.'
					});

					setTimeout(() => {
						this.backdasboard();
					}, 2000);
				}
			});
		});

		this.notificationError$ = this._taskOdoo.getNotificationError$();
		this.subscriptionError = this.notificationError$.subscribe((notificationError) => {
			this.ngZone.run(() => {
				if (notificationError) {
					this.displayModalLoading = false;
					this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creando tarea.' });
				}
			});
		});
	}

	agregarMarcador(evento) {
		this.marcadores = [];
		const coords: { lat: number; lng: number } = evento.coords;
		const nuevoMarcador = new Marcador(coords.lat, coords.lng);

		if (nuevoMarcador) {
			this.marcadores.push(nuevoMarcador);
			this.mygeo = false;
			this.headerString = 'Marcador agregado correctamente.';
			setTimeout(() => {
				this.headerString = ' ';
			}, 1000);
		}
	}

	/* 	getCurrentPosition() {
		console.log('ubicandote');
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.log(position);
			});
		} else {
			console.log('navegador invalido');
		}
	} */

	onClickMap() {
		//this.lat = parseFloat(this.taskSub.address.latitude);
		//this.lng = parseFloat(this.taskSub.longitude);
		//this.zoom = 9;
		this.displayModalMap = !this.displayModalMap;
	}

	backdasboard() {
		this.router.navigate([ '/dashboard' ], { queryParams: { tab: 'request' } });
	}

	createForm() {
		this.newServiceForm = this.fb.group({
			title: [ '', [ Validators.required ] ],
			date: [ null, [ Validators.required ] ],
			time: [ null, [ Validators.required ] ],
			description: [ '' ],
			photos: this.fb.array([
				[ '../../../../assets/img/noImage.png' ],
				[ '../../../../assets/img/noImage.png' ],
				[ '../../../../assets/img/noImage.png' ]
			]),
			address: this.fb.group({
				calle: [ '', [ Validators.required ] ],
				numero: [ '', [ Validators.required ] ],
				portal: [ '', [ Validators.required ] ],
				escalera: [ '', [ Validators.required ] ],
				piso: [ '', [ Validators.required ] ],
				puerta: [ '', [ Validators.required ] ],
				cp: [ '', [ Validators.required ] ],
				geo: [ '' ]
			}),

			materials: [ '', [ Validators.required ] ]
		});
	}
	createNewService() {
		/* this.displayModalLoading = true;

		this.task.title = this.newServiceForm.value['title'];
		this.task.date = this.date.transform(this.newServiceForm.value['date'], 'yyyy-MM-dd');
		this.task.time = this.date.transform(this.newServiceForm.value['time'], 'HH:mm:ss');
		this.task.description = this.newServiceForm.value['description'];

		if (this.Autofill) {
			this.task.address = this.user.address;
		} else {
			this.task.address = new Address(
				this.newServiceForm.value['address']['calle'],
				this.newServiceForm.value['address']['numero'],
				this.newServiceForm.value['address']['portal'],
				this.newServiceForm.value['address']['escalera'],
				this.newServiceForm.value['address']['piso'],
				this.newServiceForm.value['address']['puerta'],
				this.newServiceForm.value['address']['cp'],
				'',
				''
			);
			this.task.address.latitude = String(this.marcadores[0].lat);
			this.task.address.longitude = String(this.marcadores[0].lng);
		}
		this.task.require_materials = Boolean(Number(this.newServiceForm.value['materials']));
		this.task.client_id = this.user.partner_id; */

		/* if (typeof this.this.resizedataURL(photo, 1280, 960, index); !== 'undefined' && this.task.photoNewTaskArray.length > 0) {
			let index = 0;
			for (let photo of this.task.photoNewTaskArray) {
				this.resizedataURL(photo, 1280, 960, index);
				index++;
			}
		} */

		this.resizedataURL(this.task.photoNewTaskArray[0], 50, 50, 0);
		//1280x960
		console.log(this.task, 'tarea a crear');
		//this._taskOdoo.newTask(this.task);
	}

	openFileBrowser(event, index) {
		event.preventDefault();

		const element: HTMLElement = document.getElementById('filePicker' + index) as HTMLElement;
		element.click();
	}

	handleFileSelect(evt, index) {
		this.currentIndex = index;
		const files = evt.target.files;
		const file = files[0];
		this.urlImage = `data:${file.type};base64,`;
		if (files[0].size < this.imageSizeLimit) {
			if (files && file) {
				const reader = new FileReader();
				reader.onload = this.handleReaderLoaded.bind(this);
				reader.readAsBinaryString(file);
			}
		} else {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: this.errorMessageImage + this.imageSizeLimitKb + 'kB'
			});
		}
	}

	async handleReaderLoaded(readerEvt) {
		const binaryString = readerEvt.target.result;
		this.base64textString = btoa(binaryString);
		this.task.photoNewTaskArray[this.currentIndex] = this.base64textString;

		this.imageArticle[this.currentIndex] = this.urlImage + this.base64textString;
		try {
			this.loadImage[this.currentIndex] = true;
		} catch (error) {
			this.loadImage[this.currentIndex] = true;
		}
		console.log(this.imageArticle);
	}

	public getSafeImage(url: string) {
		return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
	}

	cancelNewService() {
		this.router.navigate([ '/dashboard' ], { queryParams: { tab: 'request' } });
	}

	autofillChange() {
		if (this.Autofill) {
			for (let value in this.user.address) {
				if (!this.user.address[value]) this.user.address[value] = '';
			}

			this.newServiceForm.patchValue({
				address: {
					puerta: this.user.address.door,
					calle: this.user.address.street,
					piso: this.user.address.floor,
					numero: this.user.address.number,
					portal: this.user.address.portal,
					cp: this.user.address.cp,
					escalera: this.user.address.stair
				}
			});
			this.newServiceForm.controls['address'].disable();
			this.mygeo = false;
		} else {
			this.newServiceForm.patchValue({
				address: {
					puerta: '',
					calle: '',
					piso: '',
					numero: '',
					portal: '',
					cp: '',
					escalera: ''
				}
			});

			this.newServiceForm.controls['address'].enable();
			this.mygeo = true;
		}
	}

	resizedataURL(datas, wantedWidth, wantedHeight, index) {
		var img = document.createElement('img');
		img.src = datas;
		img.onload = () => {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			canvas.width = wantedWidth;
			canvas.height = wantedHeight;
			ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);
			//this.task.photoNewTaskArray[index] = canvas.toDataURL();
			//console.log(this.task.photoNewTaskArray[index], 'foto rezising');
		};
	}
}
