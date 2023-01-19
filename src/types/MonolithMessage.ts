export interface IMonolithMessage {
    message_id: number;
    message_discussion: string;
    message_from: string;
    message_message: string;
    message_redacted: string;
    message_read: Date | null;
    message_created: Date;
    message_updated: Date;
    message_uuid: string;
    discussion_uuid: string;
    from_uuid: string;
}