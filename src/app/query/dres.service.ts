import {Injectable} from "@angular/core";
import {SubmissionService, SuccessfulSubmissionsStatus} from "../../../openapi/dres";
import {MediaSegmentDescriptor} from "../../../openapi/cineast";

@Injectable()
export class DresService{

  public resultHandler: ((status: SuccessfulSubmissionsStatus) => void) | undefined;
  constructor(private submissionService: SubmissionService) {

  }

  public submit(segment: MediaSegmentDescriptor){
    if(!segment){
      console.error("Cannot submit a falsy segment!")
      return;
    }

    const timecode = DresService.toTimecode(((segment.startabs || 0) + (segment.endabs || 0)) / 2)
    console.log("[DresService] Timecode: ", timecode);

    const id = segment?.objectId?.replace(/v_/, '') ?? 'n/a';
    console.log("[DresService] Id: ", id);

    this.submissionService.getApiV1Submit(
      undefined,
      id,
      undefined,
      undefined,
      undefined,
      timecode
    ).subscribe((result) => {
        if(this.resultHandler){
          this.resultHandler(result);
        }
        console.log('[DresService] Submission result: ', result);
    })
  }

  private static toTimecode(seconds: number):string{
    const hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    const minutes = Math.floor(seconds / 60);
    seconds -= (minutes * 60);

    return hours + ':' + minutes + ':' + Math.floor(seconds) + ':0';
  }
}
