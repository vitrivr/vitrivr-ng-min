import { FormControl } from '@angular/forms';
import { QueryService } from './../query/query.service';
import { Component, HostListener, NgModule, Directive, Input, ViewChild } from '@angular/core';
import { Settings } from "../settings.model";
import { MatMenuTrigger } from '@angular/material/menu';
import { LogService, QueryEventLog } from 'openapi/dres';


export interface MenuEventEntry {
  text: string, action: () => void, key?: string
}


@Component({
  selector: 'app-right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.scss']
})
export class RightClickMenuComponent {

  constructor(public queryService: QueryService) {

  }

  @Input() menuEvents !: MenuEventEntry[];
  @Input() showMenu: Boolean = true;

  public resolveByMenuItemText(index: number, item: MenuEventEntry) {
    return item.text
  }

  // coordinates 
  menuTopLeftPosition = { x: '0', y: '0' }

  // reference to the MatMenuTrigger in the DOM 
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger;


  onRightClick(event: MouseEvent, item: any) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    event.preventDefault();
    let actionPerformed = true

    for (let menuEvent of this.menuEvents) {
      if (menuEvent.key) {
        switch (menuEvent.key) {
          case "ctrl": {
            if (event.ctrlKey) { menuEvent.action() }
            break;
          }
          case "shift": {
            if (event.shiftKey) { menuEvent.action() }
            break;
          }
          case "alt": {
            if (event.altKey) { menuEvent.action() }
            break;
          }
          default: {
            actionPerformed = false
            break;
          }
        }
      }
    }

    if (this.showMenu && !actionPerformed) {
      // mouse position for menu
      this.menuTopLeftPosition.x = event.clientX + 'px';
      this.menuTopLeftPosition.y = event.clientY + 'px';
      // show menu
      this.matMenuTrigger.openMenu();
    }
  }
}
