export interface IDiscussionDTO {
    id: string;
    initiatorId: string
    type: string | null;
    state: string;
    createdAt: Date;
}
