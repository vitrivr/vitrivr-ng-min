import { Settings } from './../settings.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-tile',
  templateUrl: './result-tile.component.html',
  styleUrls: ['./result-tile.component.scss']
})
export class ResultTileComponent {

  @Input()
  segmentId: String = '';

  @Input()
  score: number = 0;

  base = Settings.thumbnailBasePath;

  get color(): String {
    let c = Math.round((1 - this.score) * 255);
    return 'rgb(' + c + ', 255, ' + c + ')';
  }

}
