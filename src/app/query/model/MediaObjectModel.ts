import {MediaSegmentModel} from "./MediaSegmentModel";
import {ScoredObject} from "../scored-object.model";

export class MediaObjectModel extends ScoredObject{
    name?: string;
    path?: string;
    mediatype?: MediaObjectModel.MediatypeEnum;
    exists?: boolean;
    contentURL?: string;
    override score: number = 0;
    override segments: Array<MediaSegmentModel> = new Array<MediaSegmentModel>();
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
