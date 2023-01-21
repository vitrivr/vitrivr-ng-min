export class ScoredSegment {

    public readonly id: String;
    public readonly score: number;


    constructor(id: String, score: number) {
        this.id = id;
        this.score = score;
    }

}