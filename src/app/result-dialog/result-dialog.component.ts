import {ScoredSegment} from './../query/scored-segment.model';
import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MediaSegmentQueryResult, SegmentService} from "../../../openapi/cineast";
import {map, Observable, tap} from "rxjs";
import {Settings} from "../settings.model";
import {SubmissionService} from "../../../openapi/dres";

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit, AfterViewInit {
  private segment: MediaSegmentQueryResult | undefined;

  mediaUrl: Observable<string> | undefined;
  @ViewChild('videoPlayer', { static: false }) video: ElementRef | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ScoredSegment,
    private segmentService: SegmentService,
    private submissionService: SubmissionService
  ) {

  }

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  ngOnInit(): void {
    this.mediaUrl = this.segmentService.findSegmentById(this.data.id).pipe(
      tap((segment) => {
          this.segment = segment;
        }
      ),
      map((segment) => {
        // @ts-ignore
        return `${Settings.objectBasePath}${this.segment?.content[0].objectId}`
      })
    );
  }

  private initPlayer(){
    if(this.video){
      this.video.nativeElement.addEventListener('timeupdate', () => {
        // @ts-ignore
        if(this.currentSegment()?.startabs <= this.video?.nativeElement.currentTime && this.video?.nativeElement.currentTime <= this.currentSegment()?.endabs){
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

  public currentSegment(){
    return this.segment?.content?.[0];
  }

  public submit() {

    const segment = this.currentSegment();
    const segmentId = this.data.id;

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

} // a bride in a white dress
