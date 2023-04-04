import { ResultDialogComponent } from './../result-dialog/result-dialog.component';
import { ResultDisplayComponent } from './../result-display/result-display.component';
import { ScoredSegment } from './../query/scored-segment.model';
import { QueryService } from './../query/query.service';
import { Settings } from './../settings.model';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {SubmissionService} from "../../../openapi/dres";

@Component({
  selector: 'app-result-tile',
  templateUrl: './result-tile.component.html',
  styleUrls: ['./result-tile.component.scss']
})
export class ResultTileComponent {

  constructor(
    private queryService: QueryService,
    private submissionService: SubmissionService,
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

    const segment = this.queryService.mediaSegment(segmentId);

    if (segment == null) {
      console.log('segment with id ' + segmentId + ' not found');
      return
    }

    const timecode = this.formatTimeCode(((segment.startabs || 0) + (segment.endabs || 0)) / 2)

    this.submissionService.getApiV1Submit(
      undefined,
      segment.objectId,
      undefined,
      undefined,
      undefined,
      timecode
    )
    console.log('submitted segment ' + segmentId);

  }

  private formatTimeCode(seconds: number): string {

    const hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    const minutes = Math.floor(seconds / 60);
    seconds -= (minutes * 60);

    return hours + ':' + minutes + ':' + seconds + ':0'; //TODO do we need leading zeros?

  }

}
