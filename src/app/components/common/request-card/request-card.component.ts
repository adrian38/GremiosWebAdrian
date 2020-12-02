import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestCardComponent implements OnInit {

  showSubCard= false;
  offersDetail= false;

  @Input() task: TaskModel;


  constructor() { }

  ngOnInit() {
    console.log(this.task)
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
