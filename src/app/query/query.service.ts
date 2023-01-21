import { ScoredSegment } from './scored-segment.model';
import { ScoredObject } from './scored-object.model';
import { QueryResult } from './query-result.model';
import { QueryTerm } from './../../../openapi/cineast/model/queryTerm';
import { TemporalQueryResult } from './../../../openapi/cineast/model/temporalQueryResult';
import { Injectable } from '@angular/core';
import { SegmentService, SegmentsService, TemporalQuery, QueryStage, StagedSimilarityQuery, TemporalObject } from 'openapi/cineast';
import { BehaviorSubject  } from 'rxjs';

@Injectable()
export class QueryService {

    public constructor(
        private segmentsService: SegmentsService,
        private segmentService: SegmentService,
    ) {

    }

    public queryRunning = new BehaviorSubject<Boolean>(false);
    public lastQueryResult = new BehaviorSubject<QueryResult | null>(null);

    public query() {

        if (this.queryRunning.getValue()) {
            console.log('only one query can be active');
            return;
        }

        this.queryRunning.next(true);

        let query = { //TODO get from UI
            queries: [
                {
                    stages:[
                        {
                            terms: [
                                {
                                    categories: ['clip'],
                                    data: 'a flat fish',
                                    type: 'TEXT'
                                } as QueryTerm
                            ]
                        } as QueryStage,
                    ]
                } as StagedSimilarityQuery/*,
                {
                    stages:[
                        {
                            terms: [
                                {
                                    categories: ['clip'],
                                    data: 'a diver',
                                    type: 'TEXT'
                                } as QueryTerm
                            ]
                        } as QueryStage,
                    ]
                } as StagedSimilarityQuery*/
            ]
        } as TemporalQuery;

        this.segmentsService.findSegmentSimilarTemporal( query ).subscribe(
            {
            complete: () => { this.queryRunning.next(false); },
            error: (error) => { 
                console.log('error during querying', error);
                this.queryRunning.next(false);
            },
            next: (result) => {
                
                if (result.content !== undefined){
                    let content = result.content as Array<TemporalObject>;
                    let queryResult = new QueryResult(
                        content.map(
                            res => new ScoredObject(
                                res.objectId || "n/a", 
                                (res.segments || new Array<string>()).map(
                                    seg => new ScoredSegment(seg, res.score || 0)
                                )
                            )
                        )
                    );

                    this.lastQueryResult.next(queryResult);

                }
                
            }
        
            }
        )

    }

}