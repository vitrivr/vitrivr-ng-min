import { ScoredSegment } from './../query/scored-segment.model';
import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ScoredSegment) {

  }

}
