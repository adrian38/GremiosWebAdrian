import { Component, OnInit, Input } from '@angular/core';
//import { loadStripe, Stripe } from '@stripe/stripe-js'
import { environment } from '../../../environments/environment';
import { TaskModel } from '../../models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
	selector: 'app-payment-stripe',
	templateUrl: './payment-stripe.component.html',
	styleUrls: [ './payment-stripe.component.scss' ]
})
export class PaymentStripeComponent {
	public visa = 'url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 0 no-repeat';
	displayModalWorker = true;
	taskPayment: TaskModel;
	isLoading: boolean = false;

	constructor(private _taskOdoo: TaskOdooService) {}

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.taskPayment = this._taskOdoo.getTaskPayment();
		this.taskPayment;
		console.log(this.taskPayment, 'pagar');
	}

	ngAfterViewInit(): void {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.

		document.getElementById('logo').style.background = this.visa;
		//console.log(this.taskPayment, 'pagar');
	}

	close() {
		console.log('cerrar');
	}

	pagar() {
		this.isLoading = true;

		console.log(this.taskPayment.id, 'this.taskPayment.id');
		console.log(this.taskPayment.origin_id, ' this.taskPayment.origin_id');

		//this._taskOdoo.acceptProvider(this.taskPayment.id, this.taskPayment.origin_id);

		/* setTimeout(() => {
			this.displayModalWorker = false;
		}, 2000); */
	}
}

/* .visa {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 0 no-repeat;
}
.mastercard {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -30px no-repeat;
}
.amex {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -60px no-repeat;
}
.diners {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -90px no-repeat;
}
.discover {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -120px no-repeat;
}
.shopping {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -150px no-repeat;
}
.naranja {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -180px no-repeat;
}
.qida {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -210px no-repeat;
}
.clubdia {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -240px no-repeat;
}
.musicred {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -270px no-repeat;
}
.nevada {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -300px no-repeat;
}
.tuya {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -330px no-repeat;
}
.laanonima {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -360px no-repeat;
}
.crediguia {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -390px no-repeat;
}
.patagonia {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -410px no-repeat;
}
.sol {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -440px no-repeat;
}
.cabal {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -470px no-repeat;
}
.cencosud {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -500px no-repeat;
}
.credimas {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -530px no-repeat;
}
.carrefour {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -560px no-repeat;
}
.grupar {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -590px no-repeat;
}
.wishgift {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -610px no-repeat;
}
.unknown {
	background: url("https://jscardvalidator-mpccmwdwqf.now.sh/cards_sprite_compressed_30.jpg") 0 -640px no-repeat;
} */
