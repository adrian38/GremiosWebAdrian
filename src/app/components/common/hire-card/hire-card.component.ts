import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-hire-card',
  templateUrl: './hire-card.component.html',
  styleUrls: ['./hire-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HireCardComponent implements OnInit {

  showSubCard= false;
  offersDetail= false;

  constructor() { }

  ngOnInit() {
  }

  onShowSubCard(offerDetail:boolean){
    if(!this.showSubCard){
      this.showSubCard = true;
      this.offersDetail = offerDetail;
    }else{
      if(this.offersDetail == offerDetail){
        this.showSubCard = false;
      }else{
        this.offersDetail = offerDetail;
      }
    }
  }
}
