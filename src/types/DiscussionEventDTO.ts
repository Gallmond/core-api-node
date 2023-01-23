export interface IDiscussionEventDTO {
    id: string;
    discussionId: string;
    customerId: string | null;
    type: string;
    parameters: string | null;
    createdAt: Date;
}
