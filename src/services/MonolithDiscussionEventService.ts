import {IMonolithDiscussion} from '../types/MonolithDiscussion'
import DiscussionRepository from '../repository/DiscussionRepository'
import {DiscussionState} from '../enums/DiscussionState'
import {MonolithDiscussionStatus} from '../enums/MonolithDiscussionStatus'
import {IDiscussionDTO} from '../types/DiscussionDTO'
import {IMonolithDiscussionEvent} from "../types/MonolithDiscussionEvent";
import {IDiscussionEventDTO} from "../types/DiscussionEventDTO";
import DiscussionEventRepository from "../repository/DiscussionEventRepository";
import {LegacyMonolithDiscussionEvents} from "../enums/LegacyMonolithDiscussionEvents";
import {DiscussionEventType} from "../enums/DiscussionEventType";
import {ValidMonolithDiscussionEvents} from "../enums/ValidMonolithDiscussionEvents";

export default class MonolithDiscussionEventService {
    #discussionEventRepository: DiscussionEventRepository

    constructor(discussionEventRepository: DiscussionEventRepository) {
        this.#discussionEventRepository = discussionEventRepository
    }

    async processRows(rows: IMonolithDiscussionEvent[]): Promise<number> {
        const discussionEventDTOs: IDiscussionEventDTO[] = rows.map(row => {
            const typeMap: { [key in ValidMonolithDiscussionEvents]: DiscussionEventType } = {
                [ValidMonolithDiscussionEvents.ENQUIRY_RECEIVED]: DiscussionEventType.REQUESTED,
                [ValidMonolithDiscussionEvents.TRIP_AGREED]: DiscussionEventType.AGREED,
                [ValidMonolithDiscussionEvents.DECLINED_REQUEST]: DiscussionEventType.DECLINED,
                [ValidMonolithDiscussionEvents.CHANGED_TRIP_DETAILS]: DiscussionEventType.DETAILS_CHANGED,
                [ValidMonolithDiscussionEvents.NO_LONGER_VALID]: DiscussionEventType.NO_LONGER_VALID,
                [ValidMonolithDiscussionEvents.UPDATED_TRIP_INFORMATION]: DiscussionEventType.INFORMATION_UPDATED,
                [ValidMonolithDiscussionEvents.DISCUSSION_REOPENED]: DiscussionEventType.REOPENED,
                [ValidMonolithDiscussionEvents.DISCUSSION_CANCELLED]: DiscussionEventType.CANCELLED,
            }

            return {
                id: row.event_uuid,
                discussionId: row.discussion_uuid,
                customerId: row.customer_uuid,
                type: typeMap[row.event_event] ?? DiscussionEventType.LEGACY,
                parameters: row.event_params,
                createdAt: row.event_created,
            }
        })

        return await this.#discussionEventRepository.createManyFromDto(discussionEventDTOs)
    }
}
