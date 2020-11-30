import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hire-sub-card',
  templateUrl: './hire-sub-card.component.html',
  styleUrls: ['./hire-sub-card.component.scss']
})
export class HireSubCardComponent implements OnInit {

  @Input() mode: boolean;
  displayModal = false;

  constructor() { }

  ngOnInit() {
  }

}
