import {FormControl} from '@angular/forms';
import {QueryService} from './../query/query.service';
import {Component, HostListener, NgModule} from '@angular/core';
import {Settings} from "../settings.model";
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DresService} from "../query/dres.service";
import {MediaSegmentDescriptor} from "../../../openapi/cineast";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {

    constructor(
        public queryService: QueryService,
        private dres: DresService,
        private snackBar: MatSnackBar) {

    }

    protected readonly localStorage = localStorage;

    public showQueryPane: Boolean = true;


    public queryRunning = this.queryService.queryRunning.asObservable();

    public toggleQueryPane() {
        this.showQueryPane = !this.showQueryPane;
    }

    public startSearch() {
        this.queryService.query();
        this.showQueryPane = false;
    }

    private _lastEnter: number = 0;


    @HostListener('window:keyup', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            const timestamp = Date.now();
            if (timestamp - this._lastEnter < 1000) {
                this.startSearch();
                this._lastEnter = 0;
            } else {
                this._lastEnter = timestamp;
            }
        }
    }

    public addInputBox() {
        this.queryService.addInput();
    }

    public removeInputBox() {
        this.queryService.removeInput();
    }


    get inputs(): Array<Map<string, FormControl>> {
        return this.queryService.inputs;
    }

    calcHeight() {
        return `${Settings.queryCategories.length * 64}px`
    }

    textSubmit(text: string) {
        if (text.trim().length > 0) {
        try {
            this.dres.submitText(text).subscribe(
                {
                    next: (result) => {
                        console.log('[DresService] Submission result: ', result);
                        let snackBarRef = this.snackBar.open(" submitted successfully", "Ok", {
                            duration: 3000,
                            panelClass: ['green-snackbar']
                        });
                    },
                    error: (error) => {
                        console.log('[DresService] Submission error: ', error);
                        if (error.status == 412) {
                            let snackBarRef = this.snackBar.open(" Status" + error.status + " Message: " + error.error.description, "Warn", {
                                duration: 5000,
                                panelClass: ['yellow-snackbar']
                            })
                        } else {
                            let snackBarRef = this.snackBar.open(" Status" + error.status + " Message: " + error.error.description, "Error", {
                                duration: 5000,
                                panelClass: ['red-snackbar']
                            })
                        }
                    }
                }
            )
        } catch (e) {
            console.log('Could not submit due to no text being present')
            let snackBarRef = this.snackBar.open( "Error submitting" + e, "Error", {
                duration: 5000,
                panelClass: ['red-snackbar']
            })
        }}else {
            let snackBarRef = this.snackBar.open( "Error submitting" + "No text found", "Error", {
                duration: 5000,
                panelClass: ['red-snackbar']
            })
        }
    }
}
