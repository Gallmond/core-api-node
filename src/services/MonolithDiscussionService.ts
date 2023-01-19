import {IMonolithDiscussion} from '../types/MonolithDiscussion'
import DiscussionRepository from '../repository/DiscussionRepository'
import {DiscussionState} from '../enums/DiscussionState'
import {MonolithDiscussionStatus} from '../enums/MonolithDiscussionStatus'
import {IDiscussionDTO} from '../types/DiscussionDTO'

export default class MonolithDiscussionService {
    #discussionRepository: DiscussionRepository

    constructor(discussionRepository: DiscussionRepository) {
        this.#discussionRepository = discussionRepository
    }

    async processRows(rows: IMonolithDiscussion[]): Promise<number> {
        const discussionDTOs: IDiscussionDTO[] = rows.map(row => {
            const states: { [key in MonolithDiscussionStatus]: DiscussionState } = {
                [MonolithDiscussionStatus.agreed]: DiscussionState.agreed,
                [MonolithDiscussionStatus.cancel]: DiscussionState.cancelled,
                [MonolithDiscussionStatus.decline]: DiscussionState.declined,
                [MonolithDiscussionStatus.discuss]: DiscussionState.discuss,
                [MonolithDiscussionStatus.request]: DiscussionState.requested,
            }

            return {
                id: row.discussion_uuid,
                initiatorId: row.discussion_sender_uuid,
                type: row.discussion_type,
                state: states[row.discussion_status],
                createdAt: row.discussion_created,
            }
        })

        return await this.#discussionRepository.createManyFromDto(discussionDTOs)
    }
}
