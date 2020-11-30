import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-sub-card',
  templateUrl: './request-sub-card.component.html',
  styleUrls: ['./request-sub-card.component.scss']
})
export class RequestSubCardComponent implements OnInit {

  @Input() mode: boolean;
  displayModal = false;

  constructor() { }

  ngOnInit() {
  }

}
