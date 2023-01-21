import { Component, NgModule } from '@angular/core';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  public showQueryPane: Boolean = true;

  public toggleQueryPane() {
    this.showQueryPane = !this.showQueryPane;
  }

}
