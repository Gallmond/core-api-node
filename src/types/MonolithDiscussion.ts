import {MonolithDiscussionStatus} from "../enums/MonolithDiscussionStatus";

export interface IMonolithDiscussion {
    discussion_id: number;
    discussion_uuid: string;
    discussion_type: string | null;
    discussion_status: MonolithDiscussionStatus;
    discussion_created: Date;
    discussion_sender_uuid: string
}
