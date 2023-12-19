/**
 * Cineast RESTful API
 * Cineast is vitrivr\'s content-based multimedia retrieval engine. This is it\'s RESTful API.
 *
 * The version of the OpenAPI document: v1
 * Contact: contact@vitrivr.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {ScoredObject} from "../scored-object.model";
import {ScoredSegment} from "../scored-segment.model";
import {MediaObjectModel} from "./MediaObjectModel";


export class MediaSegmentModel extends ScoredSegment {
    // clear ID for competition
    objectId?: string;
    objectUUID?: string;
    mediaObjectModel?: MediaObjectModel;
    start?: number;
    end?: number;
    startabs?: number;
    endabs?: number;
    count?: number;
    sequenceNumber?: number;
    override score: number = 0
}

