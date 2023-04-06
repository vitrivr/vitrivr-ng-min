import { FormControl } from '@angular/forms';
import { QueryService } from './../query/query.service';
import {Component, HostListener, NgModule} from '@angular/core';
import {Settings} from "../settings.model";


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

  private _lastEnter: number = 0;

  @HostListener('window:keyup', ['$event'])
  public keyEvent(event: KeyboardEvent){
    if (event.keyCode === 13) {
      const timestamp = Date.now();
      if (timestamp - this._lastEnter < 1000) {
        this.startSearch();
        this._lastEnter = 0;
      } else {
        this._lastEnter = timestamp;
      }
    }
  }

  public addInputBox() {
    this.queryService.addInput();
  }

  public removeInputBox() {
    this.queryService.removeInput();
  }


  get inputs(): Array<Map<string, FormControl>> {
    return this.queryService.inputs;
  }

  calcHeight() {
    return `${Settings.queryCategories.length * 64}px`
  }
}
