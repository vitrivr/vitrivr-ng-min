import {Injectable} from "@angular/core";
import {
    LoginRequest,
    LogService,
    QueryEvent,
    QueryResultLog,
    QueryEventCategory,
    SubmissionService,
    SuccessfulSubmissionsStatus,
    UserService, RankedAnswer, ApiClientAnswer, ApiClientSubmission, EvaluationClientService
} from "../../../openapi/dres";
import {MediaSegmentDescriptor} from "../../../openapi/cineast";
import {QueryResult} from "./query-result.model";

@Injectable()
export class DresService {

    public resultHandler: ((status: SuccessfulSubmissionsStatus) => void) | undefined;

    // Dres Authentification for each ...
    private token = ''

    constructor(private submissionService: SubmissionService, private userService: UserService, private logService: LogService, private evalService: EvaluationClientService) {
        let sid = localStorage.getItem('sessionId')
        let loginstate = localStorage.getItem('dresLogin')
        if (sid && loginstate == 'true') {
            this.token = sid
        } else {
            localStorage.setItem('dresLogin', 'false')
            localStorage.setItem('d', 'false')
            localStorage.setItem('sessionId', '')
            localStorage.setItem('dresUser', '');
            localStorage.setItem('dresPassword', '');
            this.token = ''
        }
    }

    public logout() {
        localStorage.setItem('dresLogin', 'false')
        localStorage.setItem('d', 'false')
        localStorage.setItem('sessionId', '')
        localStorage.setItem('dresUser', '');
        localStorage.setItem('dresPassword', '');
        this.token = ''
    }

    public login(username: string, password: string) {
        let sid = localStorage.getItem('sessionId')
        let loginstate = localStorage.getItem('dresLogin')
        localStorage.setItem('dresUser', username);
        localStorage.setItem('dresPassword', password);
        if (sid && loginstate == 'true') {
            this.token = sid
        } else {
            if (username.trim().length > 0 && password.trim().length > 0) {
                this.userService.getApiV2User().subscribe({
                    error: err => {
                        console.log('[DresService] no active session, trying to log in')
                        this.userService.postApiV2Login({
                            username: username,
                            password: password
                        } as LoginRequest).subscribe({
                            error: err1 => {
                                console.log('could not log in', err1)
                            },
                            next: value => {
                                console.log('[DresService] login successful for user', value.username)
                                console.log('[DresService] got session token', value.sessionId)

                                localStorage.setItem('dresLogin', 'true')
                                localStorage.setItem('sessionId', value.sessionId!!)
                                this.token = localStorage.getItem('sessionId') as string;
                            }
                        });
                    },
                    next: value => {
                        console.log('[DresService] got session token', value.sessionId)
                        localStorage.setItem('dresLogin', 'true')
                        localStorage.setItem('sessionId', value.sessionId!!)
                        this.token = localStorage.getItem('sessionId') as string;
                    }
                });
            }
        }
    }

    public submitByStartTime(id: string, startseconds: number) {
        return  this.submitByTime(id, startseconds, startseconds + 0.002);
    }


    public submitByTime(id: string, startseconds: number, endseconds: number) {
        console.log("[DresService] Timecode: ", startseconds, endseconds);
        console.log("[DresService] Id: ", id);

        var msStart = startseconds * 1000;
        var msEnd = endseconds * 1000;

        var evalId = localStorage.getItem('evaluationId');
        if (evalId == null) {
            console.log("No evaluation id found");
            throw new Error("No evaluation id found");
        }

        var submission = {
            "answerSets": [
                {
                    "answers": [
                        {
                            "mediaItemName": id,
                            "start": msStart,
                            "end": msEnd
                        }
                    ]
                }
            ]
        } as ApiClientSubmission

        let dresObserver = this.submissionService.postApiV2SubmitByEvaluationId(
            evalId,
            submission,
            this.token,
        );

        dresObserver.subscribe({
                error: (error) => {
                    console.log('error during querying', error);
                    throw error;
                },
                next:
                    (result) => {
                        if (this.resultHandler) {
                            this.resultHandler(result);
                        }
                        console.log('[DresService] Submission result: ', result);
                    }
            }
        )

        return dresObserver;


        /*        this.submissionService.getApiV1Submit(
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
                })*/
    }

    public submitText(text: string) {

        var evalId = localStorage.getItem('evaluationId');
        if (evalId == null) {
            console.log("No evaluation id found");
            return;
        }

        var submission = {
            "answerSets": [
                {
                    "answers": [
                        {
                            "text": text,
                        }
                    ]
                }
            ]
        } as ApiClientSubmission

        this.submissionService.postApiV2SubmitByEvaluationId(
            evalId,
            submission,
            this.token,
        ).subscribe((result) => {
            if (this.resultHandler) {
                this.resultHandler(result);
            }
            console.log('[DresService] Submission result: ', result);
        })
    }


    public submit(segment: MediaSegmentDescriptor) {
        if (!segment || !segment.objectId) {
            console.error("Cannot submit a falsy segment!")
            throw new Error("Cannot submit a falsy segment!")
        }
        try {
            return this.submitByTime(segment?.objectId.split('.')[0] ?? 'n/a', (segment.startabs || 0), (segment.endabs || 0))
        } catch (e) {
            throw e;
        }
    }

    public logResults(result: QueryResult, terms: Map<string, string>) {

        if (this.token.length == 0) { //only send logs when logged in
            return
        }

        if (result.objects.length == 0) {
            return
        }

        let rankCounter = 1;

        const queryResults = result.objects.flatMap((scoredObject, objectIndex) => {
            return scoredObject.segments.map((segment, segmentIndex) => {
                return {
                    answer: {
                        text: "",
                        mediaItemName: segment.objectId,
                        mediaItemCollectionName: "",
                        start: segment.startabs,
                        end: segment.endabs,
                    } as ApiClientAnswer,
                    rank: rankCounter++
                }
            });

        }) || [];


        let events = new Array<QueryEvent>();

        for (const term of terms) {
            events.push({
                type: term[0],
                category: QueryEventCategory.TEXT,
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

        var id = localStorage.getItem('evaluationId');
        if (id == null) {
            console.log("No evaluation id found");
            return;
        }

        this.logService.postApiV2LogQueryByEvaluationId(id, this.token, resultLog).subscribe();
        //this.logService.postApiV2LogResult(this.token, resultLog).subscribe();

    }

    public getEvaluationIds(): string[] {
        var ids = new Array<string>();
        this.evalService.getApiV2ClientEvaluationList(this.token).subscribe((result) => {
                result.forEach((result) => {
                    ids.push(result.id as string);
                });
            }
        );
        return ids;
    }

    private static toTimecode(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        seconds -= (hours * 3600);
        const minutes = Math.floor(seconds / 60);
        seconds -= (minutes * 60);

        return hours + ':' + minutes + ':' + Math.floor(seconds) + ':0';
    }

}
