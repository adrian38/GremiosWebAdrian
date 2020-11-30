import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-gremio',
  templateUrl: './dashboard-gremio.component.html',
  styleUrls: ['./dashboard-gremio.component.scss']
})
export class DashboardGremioComponent implements OnInit {

  activateTab: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      this.activateTab = params.tab;
    });
  }

}
