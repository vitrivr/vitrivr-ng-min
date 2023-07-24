import { FormControl } from '@angular/forms';
import { QueryService } from './../query/query.service';
import {Component, HostListener, NgModule, Directive, Input, ViewChild} from '@angular/core';
import {Settings} from "../settings.model";
import {MatMenuTrigger} from '@angular/material/menu';


@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.scss']
})
export class RightClickMenuComponent {

  constructor(public queryService: QueryService) {

  }
  
  @Input() menuEvents: Record<string, void> = {};
  @Input() autoPerformeFirst: Boolean = false;

  // coordinates 
  menuTopLeftPosition =  {x: '0', y: '0'}
 
  // reference to the MatMenuTrigger in the DOM 
  @ViewChild(MatMenuTrigger, { static: true })
    matMenuTrigger!: MatMenuTrigger;
 
  /** 
   * Method called when the user click with the right button 
   * @param event MouseEvent, it contains the coordinates 
   * @param item Our data contained in the row of the table 
   */ 
  onRightClick(event: MouseEvent, item: any) { 
      // preventDefault avoids to show the visualization of the right-click menu of the browser 
      event.preventDefault(); 
 
      // we record the mouse position in our object 
      this.menuTopLeftPosition.x = event.clientX + 'px'; 
      this.menuTopLeftPosition.y = event.clientY + 'px'; 
 
      // we open the menu 
      // we pass to the menu the information about our object 
      //this.matMenuTrigger.menuData = {item: item} 
 
      // we open the menu 
      this.matMenuTrigger.openMenu(); 
  } 
}
