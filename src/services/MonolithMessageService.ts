import {IMessageDTO} from '../types/MessageDTO'
import {IMonolithMessage} from '../types/MonolithMessage'
import MessageRepository from '../repository/MessageRepository'

export default class MonolithMessageService {
    #messageRepository: MessageRepository

    constructor(messageRepository: MessageRepository) {
        this.#messageRepository = messageRepository
    }

    async processRows(rows: IMonolithMessage[]): Promise<number> {
        const messageDTOs: IMessageDTO[] = rows.map(row => {
            return {
                id: row.message_uuid,
                discussionId: row.discussion_uuid,
                senderId: row.from_uuid,
                content: row.message_message,
                content_redacted: row.message_redacted,
                created_at: row.message_created,
                read_at: row.message_read,
            }
        }).filter(dto => {
            return dto.discussionId !== '' && dto.discussionId !== null && dto.content !== 'instant_default_message'
        })

        return await this.#messageRepository.createManyFromDto(messageDTOs)
    }
}
