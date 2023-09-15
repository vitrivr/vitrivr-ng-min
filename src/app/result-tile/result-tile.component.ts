import { ResultDialogComponent } from './../result-dialog/result-dialog.component';
import { ResultDisplayComponent } from './../result-display/result-display.component';
import { ScoredSegment } from './../query/scored-segment.model';
import { QueryService } from './../query/query.service';
import { Settings } from './../settings.model';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubmissionService } from "../../../openapi/dres";
import { DresService } from "../query/dres.service";
import { ContextClickComponent } from '../context-click/context-click.component';

@Component({
  selector: 'app-result-tile',
  templateUrl: './result-tile.component.html',
  styleUrls: ['./result-tile.component.scss']
})
export class ResultTileComponent implements AfterViewInit{

  constructor(
    private queryService: QueryService,
    private dresService: DresService,
    private dialog: MatDialog
  ) {
  }

  ngAfterViewInit(): void {

  }

  // reference to the MatMenuTrigger in the DOM
  @ViewChild('contextmenu', { static: true })
  contextClickComponent!: ContextClickComponent;


  @Input()
  scoredSegment: ScoredSegment = new ScoredSegment('', 0);

  base = Settings.thumbnailBasePath;

  get color(): string {
    let c = Math.round((1 - this.scoredSegment.score) * 255);
    return 'rgb(' + c + ', 255, ' + c + ')';
  }

  public show(segmentId: string) {
    this.dialog.open(ResultDialogComponent, {
      data: this.scoredSegment,
      width: '900px',
    });
  }

  public moreLikeThis(segmentId: string) {

    this.queryService.moreLikeThis(segmentId);

  }

  public getMoreLikeThisCallback(segmentId: string): () => void {
    return () => { this.moreLikeThis(segmentId) };
  }
  public getSubmitCallback(segmentId: string): () => void {
    return () => { this.submit(segmentId) };
  }

  public contextMenuCallback(event: MouseEvent, item: any) {
    this.contextClickComponent.onRightClick(event, item);
  }

  public submit(segmentId: string) {

    const segment = this.queryService.mediaSegment(segmentId);
    if (segment) {
      this.dresService.submit(segment);
    } else {
      console.log('Couldnt submit due to no segment being present')
    }

  }

}
