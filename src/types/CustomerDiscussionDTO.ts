export interface ICustomerDiscussionDTO {
    id: string;
    customerId: string
    discussionId: string;
    createdAt: Date;
    agreedAt: Date | null;
    deletedAt: Date | null;
}
