import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
  selector: 'app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryCardComponent implements OnInit {

  showSubCard= false;
  offersDetail= false;
  @Input() task: TaskModel;
  @Input() role: 'client' | 'provider';

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
