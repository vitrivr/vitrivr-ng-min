import { Settings } from './settings.model';
import { ApiModule } from './../../openapi/cineast/api.module';
import { QueryService } from './query/query.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Configuration } from 'openapi/cineast';
import { HttpClientModule } from '@angular/common/http';
import { ResultDisplayComponent } from './result-display/result-display.component';
import { CommonModule } from '@angular/common';
import { ResultTileComponent } from './result-tile/result-tile.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    ResultDisplayComponent,
    ResultTileComponent,
    ResultDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    HttpClientModule,
    ApiModule.forRoot(
      () => {
        return new Configuration({
          basePath: Settings.cineastBasePath
        });
      }
    )
  ],
  providers: [
    QueryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
