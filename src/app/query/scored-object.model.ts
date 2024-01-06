import { ScoredSegment } from "./scored-segment.model";

export class ScoredObject {

    public readonly id: String;
    protected readonly segments: Array<ScoredSegment>;
    public readonly score: number;


    public getSegments(): Array<ScoredSegment> {
        return this.segments;
    }

    public getTemporalSegments(): Array<ScoredSegment> {
        return this.segments;
    }

    constructor(id: String, segments: Array<ScoredSegment>) {
        this.id = id;
        this.segments = segments;
        this.score = ScoredObject.aggregateScores(segments);
    }

    static aggregateScores(segments: Array<ScoredSegment>): number {
        return Math.max(...segments.map(segment => segment.score));
    }

}
