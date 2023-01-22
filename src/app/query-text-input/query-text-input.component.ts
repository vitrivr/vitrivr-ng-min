import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-query-text-input',
  templateUrl: './query-text-input.component.html',
  styleUrls: ['./query-text-input.component.scss']
})
export class QueryTextInputComponent {

@Input()
controls: Map<String, FormControl> = new Map();

}
