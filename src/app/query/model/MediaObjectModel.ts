import {MediaSegmentModel} from "./MediaSegmentModel";
import {ScoredObject} from "../scored-object.model";
import {MediaTemporalModel} from "./MediaTemporalModel";

export class MediaObjectModel extends ScoredObject {
    name?: string;
    path?: string;
    mediatype?: MediaObjectModel.MediatypeEnum;
    exists?: boolean;
    contentURL?: string;
    override score: number = 0;
    override segments: Array<MediaSegmentModel> = new Array<MediaSegmentModel>();
    temporals: Array<MediaTemporalModel> = new Array<MediaTemporalModel>();

    constructor(id: string, name: string, path: string, mediatype: MediaObjectModel.MediatypeEnum, exists: boolean, contentURL: string, segments: Array<MediaSegmentModel>, temporals: Array<MediaTemporalModel>) {
        super(id, segments);
        this.name = name;
        this.path = path;
        this.mediatype = mediatype;
        this.exists = exists;
        this.contentURL = contentURL;
        this.segments = segments;
        this.temporals = temporals;
    }
    public override getSegments(): Array<MediaSegmentModel> {
        return this.segments;
    }

    public override getTemporalSegments(): Array<MediaSegmentModel> {
        let result: Array<MediaSegmentModel> = new Array<MediaSegmentModel>();
        this.temporals.forEach(temporal => {
            temporal.segments.forEach(segment => {
                result.push(segment);
            });
        });
        return result;
    }

}

export namespace MediaObjectModel {
    export type MediatypeEnum = 'VIDEO' | 'IMAGE' | 'AUDIO' | 'MODEL3D' | 'IMAGE_SEQUENCE' | 'UNKNOWN';
    export const MediatypeEnum = {
        VIDEO: 'VIDEO' as MediatypeEnum,
        IMAGE: 'IMAGE' as MediatypeEnum,
        AUDIO: 'AUDIO' as MediatypeEnum,
        MODEL3D: 'MODEL3D' as MediatypeEnum,
        IMAGE_SEQUENCE: 'IMAGE_SEQUENCE' as MediatypeEnum,
        UNKNOWN: 'UNKNOWN' as MediatypeEnum
    };
}
