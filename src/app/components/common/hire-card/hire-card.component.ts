import { Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TaskModel } from 'src/app/models/task.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
	selector: 'app-hire-card',
	templateUrl: './hire-card.component.html',
	styleUrls: [ './hire-card.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class HireCardComponent implements OnInit {
	@Input() task: TaskModel;
	@Input() role: 'client' | 'provider';

	isLoading1: boolean;
	showSubCard = false;
	offersDetail = false;

	constructor(
		private _taskOdoo: TaskOdooService,
		private _authOdoo: AuthOdooService,
		private ngZone: NgZone,
		private router: Router
	) {}

	ngOnInit() {}

	onShowSubCardDetail(offerDetail: boolean) {
		if (this.showSubCard) {
			this.showSubCard = false;
			this.offersDetail = offerDetail;
		} else {
			this.offersDetail = offerDetail;
			this.showSubCard = true;
		}
	}

	goToChat() {
		this.router.navigate([ '/chat/', this.task.id ]);
	}

	edtiName(name: string) {
		let temp = name.split(' ');
		return temp[0] + ' ' + temp[1].slice(0, 1) + '.';
	}
}
