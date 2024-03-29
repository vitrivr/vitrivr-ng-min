import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Settings} from "../settings.model";

@Component({
  selector: 'app-query-text-input',
  templateUrl: './query-text-input.component.html',
  styleUrls: ['./query-text-input.component.scss']
})
export class QueryTextInputComponent {

@Input()
controls: Map<string, FormControl> = new Map();

resolveInputLabel(key: string){
  const a = Settings.queryCategories.filter((categoryTuple) => {
    return categoryTuple[0] == key
  })[0];
  return a[1];
}

}
