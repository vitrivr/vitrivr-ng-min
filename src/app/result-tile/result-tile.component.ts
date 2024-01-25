import {ResultDialogComponent} from './../result-dialog/result-dialog.component';
import {ResultDisplayComponent} from './../result-display/result-display.component';
import {ScoredSegment} from './../query/scored-segment.model';
import {QueryService} from './../query/query.service';
import {Settings} from './../settings.model';
import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SubmissionService} from "../../../openapi/dres";
import {DresService} from "../query/dres.service";
import {ContextClickComponent} from '../context-click/context-click.component';

@Component({
    selector: 'app-result-tile',
    templateUrl: './result-tile.component.html',
    styleUrls: ['./result-tile.component.scss']
})
export class ResultTileComponent implements AfterViewInit {

    constructor(
        private queryService: QueryService,
        private dresService: DresService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
    }

    ngAfterViewInit(): void {

    }

    // reference to the MatMenuTrigger in the DOM
    @ViewChild('contextmenu', {static: true})
    contextClickComponent!: ContextClickComponent;


    @Input()
    scoredSegment: ScoredSegment = new ScoredSegment('', 0);

    base = Settings.thumbnailBasePath;
    schema = localStorage.getItem('schema') as string;

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
        return () => {
            this.moreLikeThis(segmentId)
        };
    }

    public getSubmitCallback(segmentId: string): () => void {
        return () => {
            this.submit(segmentId)
        };
    }

    public contextMenuCallback(event: MouseEvent, item: any) {
        this.contextClickComponent.onRightClick(event, item);
    }

    public submit(segmentId: string) {

        const segment = this.queryService.mediaSegment(segmentId);

        if (segment) {
            try {
                this.dresService.submit(segment).subscribe({
                        next: (result) => {
                            console.log('[DresService] Submission result: ', result);
                            let snackBarRef = this.snackBar.open(segmentId + " submitted successfully", "Ok", {
                                duration: 3000,
                                panelClass: ['green-snackbar']
                            });
                        },
                        error: (error) => {
                            console.log('[DresService] Submission error: ', error);
                            if (error.status == 412) {
                                let snackBarRef = this.snackBar.open(segmentId + " Status" + error.status + " Message: "+ error.error.description, "Warn", {
                                    duration: 5000,
                                    panelClass: ['yellow-snackbar']
                                })
                            }
                            else {
                                let snackBarRef = this.snackBar.open(segmentId + " Status" + error.status + " Message: "+ error.error.description, "Error", {
                                    duration: 5000,
                                    panelClass: ['red-snackbar']
                                })
                            }
                        }
                    }
                );

            } catch (e) {
                console.log('Could not submit due to no segment being present')
                let snackBarRef = this.snackBar.open(segmentId + "Error submitting" + e, "Error", {
                    duration: 5000,
                    panelClass: ['red-snackbar']
                })
            }

        } else {
            console.log('Could not submit due to no segment being present')
            let snackBarRef = this.snackBar.open(segmentId + "Couldnt submit due to no segment being present", "Error", {
                duration: 5000,
                panelClass: ['red-snackbar']
            })
        }

    }

}
