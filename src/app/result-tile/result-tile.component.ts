import { ResultDialogComponent } from './../result-dialog/result-dialog.component';
import { ResultDisplayComponent } from './../result-display/result-display.component';
import { ScoredSegment } from './../query/scored-segment.model';
import { QueryService } from './../query/query.service';
import { Settings } from './../settings.model';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-result-tile',
  templateUrl: './result-tile.component.html',
  styleUrls: ['./result-tile.component.scss']
})
export class ResultTileComponent {

  constructor(
    private queryService: QueryService,
    private dialog: MatDialog
    ) {

  }

  @Input()
  scoredSegment: ScoredSegment = new ScoredSegment('',0);

  base = Settings.thumbnailBasePath;

  get color(): String {
    let c = Math.round((1 - this.scoredSegment.score) * 255);
    return 'rgb(' + c + ', 255, ' + c + ')';
  }

  public show(segmentId: String) {
    this.dialog.open(ResultDialogComponent, {
      data: this.scoredSegment
    });
  }

  public moreLikeThis(segmentId: String) {

    this.queryService.moreLikeThis(segmentId);

  }

  public submit(segmentId: String) {

    console.log('TODO: submitting segment ' + segmentId);

  }

}
