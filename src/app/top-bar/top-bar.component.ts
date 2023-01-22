import { FormControl } from '@angular/forms';
import { QueryService } from './../query/query.service';
import { Component, NgModule } from '@angular/core';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  constructor(public queryService: QueryService) {

  }

  public showQueryPane: Boolean = true;

  public queryRunning = this.queryService.queryRunning.asObservable();

  public toggleQueryPane() {
    this.showQueryPane = !this.showQueryPane;
  }

  public startSearch() {
    this.queryService.query();
    this.showQueryPane = false;
  }


  get inputs(): Array<Map<String, FormControl>> {
    return this.queryService.inputs;
  }

}
