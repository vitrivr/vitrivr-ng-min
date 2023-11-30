import { FormControl } from '@angular/forms';
import { Settings } from '../settings.model';
import { StringDoublePair } from '../../../openapi/cineast';
import { SimilarityQueryResult } from '../../../openapi/cineast';
import { SimilarityQuery } from '../../../openapi/cineast';
import { ObjectService } from '../../../openapi/cineast';
import { MediaObjectDescriptor } from '../../../openapi/cineast';
import { MediaSegmentDescriptor } from '../../../openapi/cineast';
import { IdList } from '../../../openapi/cineast';
import { ScoredSegment } from './scored-segment.model';
import { ScoredObject } from './scored-object.model';
import { QueryResult } from './query-result.model';
import { QueryTerm } from '../../../openapi/cineast';
import { Injectable } from '@angular/core';
import { SegmentService, SegmentsService, TemporalQuery, StagedSimilarityQuery, TemporalObject } from 'openapi/cineast';
import { BehaviorSubject } from 'rxjs';
import {DresService} from "./dres.service";

@Injectable()
export class QueryService {

  public inputs = new Array<Map<string, FormControl>>();

  public queryRunning = new BehaviorSubject<Boolean>(false);
  public lastQueryResult = new BehaviorSubject<QueryResult>(new QueryResult([]));

  private mediaSegments = new Map<string, MediaSegmentDescriptor>()
  private mediaObjects = new Map<string, MediaObjectDescriptor>()

  private lastInputs = new BehaviorSubject<Map<string, string>>(new Map());

    public constructor(
        private segmentsService: SegmentsService,
        private segmentService: SegmentService,
        private objectService: ObjectService,
        private dresService: DresService
    ) {

        this.addInput();

        this.lastQueryResult.subscribe(result => this.dresService.logResults(result, this.lastInputs.getValue()))

    }

    public addInput() {

        let h = new Map<string, FormControl>();
        for (let element of Settings.queryCategories) {
            h.set(element[0], new FormControl())
        }

        this.inputs.push(h);

    }

    public removeInput() {
        if(this.inputs.length > 1) {
            this.inputs.splice(this.inputs.length - 1, 1);
        }
    }


    public mediaSegment(segmentId: string): MediaSegmentDescriptor | null {
      return this.mediaSegments.get(segmentId) || null;
    }

    public query() {

        if (this.queryRunning.getValue()) {
            console.log('only one query can be active');
            return;
        }

        let queries = new Array<StagedSimilarityQuery>();

        let i = 0;
        let termsMap = new Map<string, string>();

        for (let input of this.inputs) {
            let terms = new Array<QueryTerm>();

            for (let [key, value] of input) {

                if (value.value == null) {
                    continue;
                }

                terms.push(
                    {
                        categories: [key],
                        data: value.value,
                        type: 'TEXT'
                    } as QueryTerm
                );

                termsMap.set(key + i, value.value);

            }

            if (terms.length > 0) {
                queries.push(
                    {
                        stages: [
                            {
                                terms: terms
                            }
                        ]

                    } as StagedSimilarityQuery
                )
            }
          ++i;
        }

        if (queries.length == 0) {
            return;
        }

        let query = {
            queries: queries
        } as TemporalQuery;

        this.lastInputs.next(termsMap);

        console.log('starting query');

        this.queryRunning.next(true);
        this.lastQueryResult.next(new QueryResult([])); //reset display

        this.segmentsService.findSegmentSimilarTemporal(query).subscribe(
            {
                //complete: () => { this.queryRunning.next(false); },
                error: (error) => {
                    console.log('error during querying', error);
                    this.queryRunning.next(false);
                },
                next: (result) => {

                    if (result.content !== undefined) {
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

                        // lookup unknown segments
                        let unknown_ids = [...new Set(content.flatMap(res => (res.segments || new Array<string>())))].filter(id => !this.mediaSegments.has(id))

                        if (unknown_ids.length > 0) {

                            console.log('looking up ' + unknown_ids.length + ' segment descriptors');

                            this.segmentService.findSegmentByIdBatched(
                                {
                                    ids: unknown_ids
                                } as IdList
                            ).subscribe({
                                next: (result) => {
                                    if (result.content !== undefined) {
                                        let descriptors = result.content as Array<MediaSegmentDescriptor>;
                                        descriptors.forEach(d => { if (d.segmentId !== undefined) { this.mediaSegments.set(d.segmentId, d); } });

                                        console.log('received ' + descriptors.length + ' segment descriptors');

                                        // lookup unknown segments
                                        let unknown_ids = [...new Set(descriptors.flatMap(descriptor => (descriptor.objectId || "")))].filter(id => id !== "" && !this.mediaObjects.has(id))

                                        if (unknown_ids.length > 0) {

                                            console.log('looking up ' + unknown_ids.length + ' object descriptors');

                                            this.objectService.findObjectsByIdBatched(
                                                {
                                                    ids: unknown_ids
                                                } as IdList
                                            ).subscribe({
                                                next: (result) => {
                                                    if (result.content !== undefined) {
                                                        let descriptors = result.content as Array<MediaObjectDescriptor>;

                                                        descriptors.forEach(d => { if (d.objectid !== undefined) { this.mediaObjects.set(d.objectid, d); } });

                                                        console.log('received ' + descriptors.length + ' object descriptors');

                                                        //all segments and objects received, query complete
                                                        this.lastQueryResult.next(queryResult);
                                                        this.queryRunning.next(false);
                                                    }
                                                },
                                                error: (error) => {
                                                    console.log('error during object descriptor lookup', error);
                                                }
                                            });
                                        } else { //no unknown object ids
                                            this.lastQueryResult.next(queryResult);
                                            this.queryRunning.next(false);
                                        }
                                    }
                                },
                                error: (error) => {
                                    console.log('error during segment descriptor lookup', error);
                                }

                            });
                        } else { //no unknown segment ids, request complete
                            this.lastQueryResult.next(queryResult);
                            this.queryRunning.next(false);
                        }
                    }
                }
            }
        )
    }

    public moreLikeThis(segmentId: string) {

        if (this.queryRunning.getValue()) {
            console.log('only one query can be active');
            return;
        }

        console.log('starting query');

        this.queryRunning.next(true);
        this.lastQueryResult.next(new QueryResult([])); //reset display

        this.segmentsService.findSegmentSimilar(
            {
                terms: [
                    {
                        categories: [Settings.moreLikeThisCategory],
                        type: 'ID',
                        data: segmentId
                    } as QueryTerm
                ]
            } as SimilarityQuery
        ).subscribe({
            next: (result) => {
                if (result.results !== undefined) {
                    let resultPairs = (result.results as Array<SimilarityQueryResult>)[0].content || new Array<StringDoublePair>; // since only one category is used, no fusion is necessary

                    let unknown_ids = [...new Set(resultPairs.map(pair => pair.key || '').filter(id => id !== '' && !this.mediaSegments.has(id)))]

                    if (unknown_ids.length > 0) {

                        this.segmentService.findSegmentByIdBatched(
                            {
                                ids: unknown_ids
                            } as IdList
                        ).subscribe({
                            next: (result) => {
                                if (result.content !== undefined) {
                                    let descriptors = result.content as Array<MediaSegmentDescriptor>;
                                    descriptors.forEach(d => { if (d.segmentId !== undefined) { this.mediaSegments.set(d.segmentId, d); } });

                                    console.log('received ' + descriptors.length + ' segment descriptors');

                                    // lookup unknown segments
                                    let unknown_ids = [...new Set(descriptors.flatMap(descriptor => (descriptor.objectId || "")))].filter(id => id !== "" && !this.mediaObjects.has(id))

                                    if (unknown_ids.length > 0) {

                                        console.log('looking up ' + unknown_ids.length + ' object descriptors');

                                        this.objectService.findObjectsByIdBatched(
                                            {
                                                ids: unknown_ids
                                            } as IdList
                                        ).subscribe({
                                            next: (result) => {
                                                if (result.content !== undefined) {
                                                    let descriptors = result.content as Array<MediaObjectDescriptor>;

                                                    descriptors.forEach(d => { if (d.objectid !== undefined) { this.mediaObjects.set(d.objectid, d); } });

                                                    console.log('received ' + descriptors.length + ' object descriptors');

                                                    //all segments and objects received, query complete
                                                    this.lastQueryResult.next(this.processResultPairs(resultPairs));
                                                    this.queryRunning.next(false);
                                                }
                                            },
                                            error: (error) => {
                                                console.log('error during object descriptor lookup', error);
                                            }
                                        });
                                    } else {
                                        this.lastQueryResult.next(this.processResultPairs(resultPairs));
                                        this.queryRunning.next(false);
                                    }
                                }
                            }
                        });

                    } else {
                        this.lastQueryResult.next(this.processResultPairs(resultPairs));
                        this.queryRunning.next(false);
                    }


                }

            },
            error: (error) => {
                console.log('error during more-like-this query', error);
                this.queryRunning.next(false);
            }
        });

    }

    private processResultPairs(results: Array<StringDoublePair>): QueryResult {

        let objects = new Map<string, Array<ScoredSegment>>();

        for (let pair of results) {
            let segmentDescriptor = this.mediaSegments.get(pair.key || '')
            if (segmentDescriptor !== undefined) {
                let objectId = segmentDescriptor.objectId || '';
                if (!objects.has(objectId)) {
                    objects.set(objectId, new Array<ScoredSegment>());
                }
                objects.get(objectId)?.push(new ScoredSegment(pair.key || '', pair.value || 0))
            }
        }

        let scoredObjects = new Array<ScoredObject>();

        for (let [objectId, segments] of objects) {
            scoredObjects.push(new ScoredObject(objectId, segments));
        }

        return new QueryResult(scoredObjects);

    }
}
