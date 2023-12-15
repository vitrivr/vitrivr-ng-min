import { Settings } from './settings.model';
import { ApiModule } from '../../openapi/cineast';
import { ApiModule as EngineModule} from '../../openapi/engine';
import { ApiModule as DresApi } from 'openapi/dres/api.module';
import { QueryService } from './query/query.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ContextClickComponent } from './context-click/context-click.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Configuration } from 'openapi/cineast';
import { Configuration as EngineConfiguration } from 'openapi/engine';
import { Configuration as DresConfig } from 'openapi/dres';
import { HttpClientModule } from '@angular/common/http';
import { ResultDisplayComponent } from './result-display/result-display.component';
import { CommonModule } from '@angular/common';
import { ResultTileComponent } from './result-tile/result-tile.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
import { QueryTextInputComponent } from './query-text-input/query-text-input.component';
import { DresService } from "./query/dres.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {from} from "rxjs";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    ResultDisplayComponent,
    ResultTileComponent,
    ContextClickComponent,
    ResultDialogComponent,
    QueryTextInputComponent
  ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressBarModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ApiModule.forRoot(
            () => {
                return new Configuration({
                    basePath: Settings.cineastBasePath
                });
            }
        ),
        DresApi.forRoot(
            () => {
                return new DresConfig({
                    basePath: Settings.dresBaseApi, withCredentials: true
                });
            }
        ),
        EngineModule.forRoot(
            () => {
                return new EngineConfiguration({
                    basePath: Settings.engineBasePath
                });
            }
        ),
        MatTooltipModule,
        MatSelectModule,
    ],
  providers: [
    QueryService,
    DresService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
