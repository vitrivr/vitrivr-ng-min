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
  selector: 'app-context-click',
  templateUrl: './context-click.component.html',
  styleUrls: ['./context-click.component.scss']
})
export class ContextClickComponent {

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

  // Menu gets shown only if showMenu set on true
  // and ther is no "quick action" performed by clicking ctr,ashift or alt
  onRightClick(event: MouseEvent, item: any) {

    event.preventDefault();
    let actionPerformed = false
    if (event.ctrlKey || event.shiftKey|| event.altKey){
      // checks if any entry of the menu matches the quick action key
      for (let menuEvent of this.menuEvents) {
          switch (menuEvent.key) {
            case "ctrl": {
              if (event.ctrlKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            case "shift": {
              if (event.shiftKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            case "alt": {
              if (event.altKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            case "ctrl-shift": {
              if (event.ctrlKey && event.shiftKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            case "ctrl-alt": {
              if (event.ctrlKey && event.altKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            case "ctrl-shift-alt": {
              if (event.ctrlKey && event.shiftKey && event.altKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            case "shift-alt": {
              if (event.shiftKey && event.altKey) { menuEvent.action(); actionPerformed = false; }
              break;
            }
            default: {
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
  
  onOffContextClick(event: MouseEvent, item: any){
    this.matMenuTrigger.closeMenu();
  }
}
