import { ScoredSegment } from "./scored-segment.model";

export class ScoredObject {

    public readonly id: String;
    public readonly segments: Array<ScoredSegment>;
    public readonly score: number;

    constructor(id: String, segments: Array<ScoredSegment>) {
        this.id = id;
        this.segments = segments;
        this.score = ScoredObject.aggregateScores(segments);
    }



    static aggregateScores(segments: Array<ScoredSegment>): number {
        return Math.max(...segments.map(segment => segment.score));
    }

}
