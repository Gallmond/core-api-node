export interface ITripDTO {
    id: string;
    discussionId: string;
    guestId: string;
    hostId: string;
    propertyId: string;
    startDate: Date | null;
    endDate: Date | null;
    pointsValue: number | null;
    createdAt: Date;
}
