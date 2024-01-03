import {FormControl} from '@angular/forms';
import {Settings} from '../settings.model';
import {ScoredSegment} from './scored-segment.model';
import {ScoredObject} from './scored-object.model';
import {QueryResult} from './query-result.model';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DresService} from "./dres.service";
import {
    InformationNeedDescription,
    InputData,
    OperatorDescription,
    QueryContext, QueryResultRetrievable,
    RetrievalService
} from "../../../openapi/engine";
import {HttpContext, HttpContextToken} from "@angular/common/http";
import {MediaObjectModel} from "./model/MediaObjectModel";
import {MediaSegmentModel} from "./model/MediaSegmentModel";

@Injectable()
export class QueryService {

    public inputs = new Array<Map<string, FormControl>>();

    public queryRunning = new BehaviorSubject<Boolean>(false);
    public lastQueryResult = new BehaviorSubject<QueryResult>(new QueryResult([]));

    private mediaSegments = new Map<string, MediaSegmentModel>()
    private mediaObjects = new Map<string, MediaObjectModel>()

    private lastInputs = new BehaviorSubject<Map<string, string>>(new Map());


    public constructor(
        private retrievalService: RetrievalService,
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
        if (this.inputs.length > 1) {
            this.inputs.splice(this.inputs.length - 1, 1);
        }
    }


    public mediaSegment(segmentId: string): MediaSegmentModel | null {
        return this.mediaSegments.get(segmentId) || null;
    }

    public query() {

        if (this.queryRunning.getValue()) {
            console.log('only one query can be active');
            return;
        }


        let ic = 0;
        let termsMap = new Map<string, string>();

        for (let input of this.inputs) {
            for (let [key, value] of input) {
                if (value.value == null) {
                    continue;
                }
                termsMap.set(key + ic, value.value);
            }
            ++ic;
        }

        this.lastInputs.next(termsMap);
        console.log('starting query');

        this.queryRunning.next(true);
        this.lastQueryResult.next(new QueryResult([])); //reset display

        // @ts-ignore
        let text = termsMap.get("clip0") || "";
        let informationNeedDescription =
            {
                "inputs": {
                    "mytext": {"type": "TEXT", "data": `${text}`}
                },
                "operations": {
                    "clip": {"type": "RETRIEVER", "field": "clip", "input": "mytext"},
                    "relations": {
                        "type": "TRANSFORMER",
                        "transformerName": "RelationExpander",
                        "input": "clip",
                        "properties": {"outgoing": "partOf"}
                    },
                    "lookup": {
                        "type": "TRANSFORMER",
                        "transformerName": "FieldLookup",
                        "input": "relations",
                        "properties": {"field": "time", "keys": "start, end"}
                    },
                    "aggregator": {"type": "TRANSFORMER", "transformerName": "ScoreAggregator", "input": "lookup"},
                    "lookup2": {
                        "type": "TRANSFORMER",
                        "transformerName": "FieldLookup",
                        "input": "aggregator",
                        "properties": {"field": "file", "keys": "path"}
                    }
                },
                "context": {
                    "global": {
                        "limit": `${Settings.resultPageSize}`
                    },
                    "local": {}
                },
                "output": "lookup2"
            } as InformationNeedDescription;
        this.genricQuery(informationNeedDescription);

    }

    public genricQuery(informationNeedDescription: InformationNeedDescription) {
        this.mediaObjects.clear();
        this.mediaSegments.clear();
        let schema = localStorage.getItem('schema')
        if (schema == null) {
            console.error('no schema selected');
            return;
        }
        this.retrievalService.postExecuteQuery(schema, informationNeedDescription, 'body', false, {
            httpHeaderAccept: 'application/json',
        }).subscribe(
            {
                error: (error) => {
                    console.log('error during querying', error);
                    this.queryRunning.next(false);
                },
                next: (result) => {
                    if (result.retrievables !== undefined) {
                        // Parse all segments and add to map
                        let content = result.retrievables as Array<QueryResultRetrievable>;
                        content.forEach((retrievable) => {
                            if (retrievable.type === "segment" || retrievable.type === "") {
                                let segment: MediaSegmentModel = {
                                    id: retrievable.id,
                                    objectId: "",
                                    objectUUID: "",
                                    mediaObjectModel: undefined,
                                    start: (+retrievable.properties["start"]) / 1_000_000_000,
                                    end: (+retrievable.properties["end"]) / 1_000_000_000,
                                    startabs: (+retrievable.properties["start"]) / 1_000_000_000,
                                    endabs: (+retrievable.properties["end"]) / 1_000_000_000,
                                    count: 0,
                                    sequenceNumber: 0,
                                    score: retrievable.score
                                };
                                if (segment.id != null) {
                                    this.mediaSegments.set(segment.id, segment);
                                }
                            }
                        });
                        // Parse all objects find all according segments and add to map
                        content.forEach((retrievable) => {
                            if (retrievable.type === "source") {
                                let segments = new Array<MediaSegmentModel>();
                                retrievable.parts.forEach((part) => {
                                    let segment = this.mediaSegments.get(part);
                                    if (segment != null) {
                                        segment.objectId = retrievable.id;
                                        segments.push(segment);
                                    } else {
                                        console.log('segment not found', part);
                                    }
                                });
                                let object: MediaObjectModel = {
                                    id: retrievable.id,
                                    name: "",
                                    path: (retrievable.properties["path"] as unknown as string).replace(/^.*[\\/]/, ''),
                                    mediatype: retrievable.properties["mediatype"] as unknown as MediaObjectModel.MediatypeEnum,
                                    exists: false,
                                    contentURL: "",
                                    score: retrievable.score,
                                    segments: segments
                                };
                                if (object.id != null) {
                                    for (let segment of segments) {
                                        segment.objectUUID = object.id.toString();
                                        segment.objectId = object.path;
                                        segment.mediaObjectModel = object;
                                    }
                                    this.mediaObjects.set(object.id.toString(), object);
                                }
                            }
                        });
                        console.log('query result');

                        this.lastQueryResult.next(new QueryResult(Array.from(this.mediaObjects.values()).sort(
                            (a, b) => b.score - a.score
                        )));
                        this.queryRunning.next(false);
                    }
                }
            }
        )
    }

    public moreLikeThis(segmentId: string) {
        let informationNeedDescription =
            {
                "inputs": {
                    "myId": {"type": "ID", "id": `${segmentId}`}
                },
                "operations": {
                    "clip": {"type": "RETRIEVER", "field": "clip", "input": "myId"},
                    "relations": {
                        "type": "TRANSFORMER",
                        "transformerName": "RelationExpander",
                        "input": "clip",
                        "properties": {"outgoing": "partOf"}
                    },
                    "lookup": {
                        "type": "TRANSFORMER",
                        "transformerName": "FieldLookup",
                        "input": "relations",
                        "properties": {"field": "time", "keys": "start, end"}
                    },
                    "aggregator": {"type": "TRANSFORMER", "transformerName": "ScoreAggregator", "input": "lookup"},
                    "lookup2": {
                        "type": "TRANSFORMER",
                        "transformerName": "FieldLookup",
                        "input": "aggregator",
                        "properties": {"field": "file", "keys": "path"}
                    }
                },
                "context": {
                    "global": {
                        "limit": `${Settings.resultPageSize}`
                    },
                    "local": {}
                },
                "output": "lookup2"
            } as InformationNeedDescription;
        this.genricQuery(informationNeedDescription);
    }

    public getSegmentById(segmentId: string): MediaSegmentModel | undefined {
        return this.mediaSegments.get(segmentId);
    }
}
