export interface IMessageDTO {
    id: string;
    discussionId: string;
    senderId: string;
    content: string;
    content_redacted: string;
    created_at: Date;
    read_at: Date | null;
}
