import {ScoredSegment} from './../query/scored-segment.model';
import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MediaSegmentQueryResult, SegmentService} from "../../../openapi/cineast";
import {map, Observable, of, publish, tap} from "rxjs";

import {SubmissionService} from "../../../openapi/dres";
import {DresService} from "../query/dres.service";
import {QueryService} from "../query/query.service";
import {MediaSegmentModel} from "../query/model/MediaSegmentModel";
import {Settings} from "../settings.model";

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit, AfterViewInit {
  private segment: MediaSegmentModel | undefined;
  private path = Settings.objectBasePath;
  private schema = Settings.schema;

  mediaUrl: Observable<string> | undefined;
  @ViewChild('videoPlayer', { static: false }) video: ElementRef | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ScoredSegment,
    private queryService: QueryService,
    private dres: DresService
  ) {

  }

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  ngOnInit(): void {
    this.segment = this.queryService.getSegmentById(this.data.id);
    let url = `${this.path}`+"/"+`${this.schema}`+"/"+`${this.segment?.mediaObjectModel?.path}`;
    this.mediaUrl = of(url);
  }

  private initPlayer(){
    if(this.video){
      this.video.nativeElement.addEventListener('timeupdate', () => {
        // @ts-ignore
        if(this.currentSegment()?.startabs == this.video?.nativeElement.currentTime && this.video?.nativeElement.currentTime <= this.currentSegment()?.endabs){
          this.addOnSegmentClass();
        }else{
          this.removeOnSegmentClass();
        }
      });
      this.video.nativeElement.addEventListener('loadeddata', () => {
        // @ts-ignore
        this.video.nativeElement.currentTime = this.currentSegment()?.startabs ?? 0;
        // @ts-ignore
        this.video?.nativeElement?.play().then((_) => {});
      })
    }
  }

  private addOnSegmentClass(){
    if (!this.video?.nativeElement?.classList.contains('onSegment')) {
      this.video?.nativeElement.classList.add('onSegment');
    }
  }

  private removeOnSegmentClass(){
    if (this.video?.nativeElement?.classList.contains('onSegment')) {
      this.video?.nativeElement.classList.remove('onSegment');
    }
  }

  public currentSegment():  MediaSegmentModel | undefined{
    return this.segment;
  }

  public submit() {
    // @ts-ignore
    this.dres.submitByTime(this.currentSegment().objectId.replace(/v_/, '') ?? 'n/a',this.video.nativeElement.currentTime);
  }
}
