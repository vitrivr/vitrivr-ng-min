import {Injectable} from "@angular/core";
import {
  LoginRequest,
  LogService, QueryEvent, QueryResult as DresQueryResult, QueryResultLog,
  SubmissionService,
  SuccessfulSubmissionsStatus,
  UserService
} from "../../../openapi/dres";
import {MediaSegmentDescriptor} from "../../../openapi/cineast";
import {Settings} from "../settings.model";
import {QueryResult} from "./query-result.model";

@Injectable()
export class DresService {

  public resultHandler: ((status: SuccessfulSubmissionsStatus) => void) | undefined;

  private token = ''

  constructor(private submissionService: SubmissionService, private userService: UserService, private logService: LogService) {

    if (Settings.dresUser.trim().length > 0) {
      userService.getApiV1User().subscribe({
        error: err => {
          console.log('[DresService] no active session, trying to log in')
          userService.postApiV1Login({
            username: Settings.dresUser,
            password: Settings.dresPassword
          } as LoginRequest).subscribe({
            error: err1 => {
              console.log('could not log in', err1)
            },
            next: value => {
              console.log('[DresService] login successful for user', value.username)
              console.log('[DresService] got session token', value.sessionId)
              this.token = value.sessionId!!;
            }
          });
        },
        next: value => {
          console.log('[DresService] got session token', value.sessionId)
          this.token = value.sessionId!!;
        }
      });
    }

  }

  public submitByTime(id: string, seconds: number) {
    const timecode = DresService.toTimecode(seconds)
    console.log("[DresService] Timecode: ", timecode);
    console.log("[DresService] Id: ", id);

    this.submissionService.getApiV1Submit(
      undefined,
      id,
      undefined,
      undefined,
      undefined,
      timecode,
      this.token
    ).subscribe((result) => {
      if (this.resultHandler) {
        this.resultHandler(result);
      }
      console.log('[DresService] Submission result: ', result);
    })
  }

  public submit(segment: MediaSegmentDescriptor) {
    if (!segment) {
      console.error("Cannot submit a falsy segment!")
      return;
    }

    this.submitByTime(segment?.objectId?.replace(/v_/, '') ?? 'n/a', ((segment.startabs || 0) + (segment.endabs || 0)) / 2)
  }

  public logResults(result: QueryResult, terms: Map<string, string>) {

    if (result.objects.length == 0) {
      return
    }

    const queryResults = result.objects.flatMap((value, index) => {
      return {
        item: value.id,
        score: value.score,
        rank: index

      } as DresQueryResult;
    }) || [];

    let events = new Array<QueryEvent>();

    for (const term of terms) {
      events.push({
        type: QueryEvent.CategoryEnum.TEXT,
        category: term[0],
        value: term[1],
        timestamp: Date.now()
      } as QueryEvent);
    }

    const resultLog = {
      timestamp: Date.now(),
      sortType: "",
      resultSetAvailability: "",
      results: queryResults,
      events: events
    } as QueryResultLog

    this.logService.postApiV1LogResult(this.token, resultLog).subscribe();

  }

  private static toTimecode(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    const minutes = Math.floor(seconds / 60);
    seconds -= (minutes * 60);

    return hours + ':' + minutes + ':' + Math.floor(seconds) + ':0';
  }

}
