export class ScoredSegment {

    public readonly id: string;
    public readonly score: number;


    constructor(id: string, score: number) {
        this.id = id;
        this.score = score;
    }

}
