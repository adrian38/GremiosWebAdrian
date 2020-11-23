import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewRequestComponent implements OnInit {

  signupForm: FormGroup;
  serviceName: string;
  frequency: string;

  constructor(private route: ActivatedRoute) {
    this.serviceName = this.route.snapshot.queryParams.service
  }

  ngOnInit() {
  }

}
