import { ScoredObject } from './../query/scored-object.model';
import { QueryService } from './../query/query.service';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import {ScoredSegment} from "../query/scored-segment.model";

@Component({
  selector: 'app-result-display',
  templateUrl: './result-display.component.html',
  styleUrls: ['./result-display.component.scss']
})
export class ResultDisplayComponent {

  constructor(public queryService: QueryService) {

  }

  public queryResults = this.queryService.lastQueryResult.asObservable().pipe(map(res => res == null ? new Array<ScoredObject>() : res.objects));

  trackBySegment(index: number, item: ScoredSegment){
    return item.id;
  }

  trackById(index: number, item: ScoredObject | ScoredSegment){
    return item['id'];
  }

}
