export interface IMonolithDiscussion {
    discussion_id: number;
    discussion_uuid: string;
    discussion_type: string | null;
    discussion_status: string | null;
    discussion_created: Date;
    discussion_sender_uuid: string
}
