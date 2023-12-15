import { ScoredObject } from "./scored-object.model";
import {MediaObjectModel} from "./model/MediaObjectModel";

export class QueryResult {

    public readonly objects: Array<MediaObjectModel>

    constructor(objects: Array<MediaObjectModel>) {
        this.objects = objects.sort((o1, o2) => o2.score - o1.score);
    }

}