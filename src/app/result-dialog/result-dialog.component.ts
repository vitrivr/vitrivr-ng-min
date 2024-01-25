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
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-result-dialog',
    templateUrl: './result-dialog.component.html',
    styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit, AfterViewInit {
    private segment: MediaSegmentModel | undefined;
    private path = Settings.objectBasePath;
    private schema = localStorage.getItem('schema') as string;

    mediaUrl: Observable<string> | undefined;
    @ViewChild('videoPlayer', {static: false}) video: ElementRef | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ScoredSegment,
        private snackBar: MatSnackBar,
        private queryService: QueryService,
        private dres: DresService
    ) {

    }

    ngAfterViewInit(): void {
        this.initPlayer();
    }

    ngOnInit(): void {
        this.segment = this.queryService.getSegmentById(this.data.id);
        var formatAlignedModel = this.segment?.mediaObjectModel?.path?.split('.')[0] + ".mp4";
        let url = `${this.path}` + "/" + `${this.schema}` + "/" + `${formatAlignedModel}`;
        this.mediaUrl = of(url);
    }

    private initPlayer() {
        if (this.video) {
            this.video.nativeElement.addEventListener('timeupdate', () => {
                // @ts-ignore
                if (this.currentSegment()?.startabs <= this.video?.nativeElement.currentTime && this.video?.nativeElement.currentTime <= this.currentSegment()?.endabs) {
                    this.addOnSegmentClass();
                } else {
                    this.removeOnSegmentClass();
                }
            });
            this.video.nativeElement.addEventListener('loadeddata', () => {
                // @ts-ignore
                this.video.nativeElement.currentTime = this.currentSegment()?.startabs ?? 0;
                // @ts-ignore
                this.video?.nativeElement?.play().then((_) => {
                });
            })
        }
    }

    private addOnSegmentClass() {
        if (!this.video?.nativeElement?.classList.contains('onSegment')) {
            this.video?.nativeElement.classList.add('onSegment');
        }
    }

    private removeOnSegmentClass() {
        if (this.video?.nativeElement?.classList.contains('onSegment')) {
            this.video?.nativeElement.classList.remove('onSegment');
        }
    }

    public currentSegment(): MediaSegmentModel | undefined {
        return this.segment;
    }

    public submit() {

        try {
            // @ts-ignore
            this.dres.submitByStartTime(this.currentSegment().objectId.split('.')[0] ?? 'n/a', this.video.nativeElement.currentTime).subscribe(
                {
                    next: (result) => {
                        console.log('[DresService] Submission result: ', result);
                        let snackBarRef = this.snackBar.open( " submitted successfully", "Ok", {
                            duration: 3000,
                            panelClass: ['green-snackbar']
                        });
                    },
                    error: (error) => {
                        console.log('[DresService] Submission error: ', error);
                        if (error.status == 412) {
                            let snackBarRef = this.snackBar.open( " Status" + error.status + " Message: "+ error.error.description, "Warn", {
                                duration: 5000,
                                panelClass: ['yellow-snackbar']
                            })
                        }
                        else {
                            let snackBarRef = this.snackBar.open( " Status" + error.status + " Message: "+ error.error.description, "Error", {
                                duration: 5000,
                                panelClass: ['red-snackbar']
                            })
                        }
                    }
                }
            )

        } catch (e) {
            console.log('Could not submit due to no segment being present')
            let snackBarRef = this.snackBar.open( "Error submitting" + e, "Error", {
                duration: 5000,
                panelClass: ['red-snackbar']
            })
        }
    }
}
