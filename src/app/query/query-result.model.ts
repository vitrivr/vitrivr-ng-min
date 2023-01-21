import { ScoredObject } from "./scored-object.model";

export class QueryResult {

    public readonly objects: Array<ScoredObject>

    constructor(objects: Array<ScoredObject>) {
        this.objects = objects.sort((o1, o2) => o2.score - o1.score);
    }

}