import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-sub-card',
  templateUrl: './history-sub-card.component.html',
  styleUrls: ['./history-sub-card.component.scss']
})
export class HistorySubCardComponent implements OnInit {

  @Input() mode: boolean;
  displayModal = false;

  constructor() { }

  ngOnInit() {
  }

}
