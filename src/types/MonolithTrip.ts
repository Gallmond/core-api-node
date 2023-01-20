export interface IMonolithTrip {
    trip_id: number;
    trip_uuid: string;
    trip_discussion: number;
    trip_guest: number;
    trip_host: number;
    trip_property: number;
    trip_start: Date | null;
    trip_end: Date | null;
    trip_points_value: number | null;
    trip_created: Date;
    discussion_uuid: string;
    guest_uuid: string;
    host_uuid: string;
    property_uuid: string;
}
