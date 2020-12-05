import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from '../../../../models/task.model';

@Component({
  selector: 'app-request-sub-card',
  templateUrl: './request-sub-card.component.html',
  styleUrls: ['./request-sub-card.component.scss']
})
export class RequestSubCardComponent implements OnInit {

  @Input() mode: boolean;
  @Input() taskSub: TaskModel;
  displayModal = false;

  userType: string = "";
  user: UsuarioModel;

  offersList:TaskModel[];
  offersList$: Observable<TaskModel[]>;

  constructor(private router: Router,
    private _taskOdoo: TaskOdooService,
    private _authOdoo: AuthOdooService,
    private ngZone: NgZone) {

    this.user = this._authOdoo.getUser();
    this.offersList = [];
    this.userType = this.user.type;
  }

  ngOnInit() {
    this.offersList$ = this._taskOdoo.getOffers$();
    this.offersList$.subscribe(offersList =>{

      this.ngZone.run( () => {

       

        if(offersList.find(element=>element.origin))
        {
        let temp = (offersList.find(element=>element.origin));

        if(this.taskSub.id_string === temp.origin)
        {
          this.offersList= offersList;
        }
      }
      });
    });
  }

}
