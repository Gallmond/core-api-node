import {ValidMonolithDiscussionEvents} from "../enums/ValidMonolithDiscussionEvents";

export interface IMonolithDiscussionEvent {
    event_id: number;
    event_uuid: string;
    event_event: ValidMonolithDiscussionEvents;
    event_params: string | null;
    event_created: Date;
    customer_uuid: string | null;
    discussion_uuid: string;
}
