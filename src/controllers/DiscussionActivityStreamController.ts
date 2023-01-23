import Prisma from '../repository/Prisma'
import MessageRepository from '../repository/MessageRepository'
import DiscussionRepository from '../repository/DiscussionRepository'
import {Request, Response} from 'express'

export default new class DiscussionActivityStreamController
{
    messageRepository: MessageRepository
    discussionRepository: DiscussionRepository

    constructor() {
        this.messageRepository = new MessageRepository(Prisma.client)
        this.discussionRepository = new DiscussionRepository(Prisma.client)
    }

    async index(req: Request, res: Response): Promise<Response> {
        if (!req.authenticated || !req.customer) {
            return res.status(401).json({
                error: {
                    'message': 'Unauthorised',
                }
            })
        }

        const discussion = await this.discussionRepository.findForCustomerById(req.customer.id, req.params.id)

        if (!discussion) {
            return res.status(404).json({
                error: {
                    'message': 'Discussion not found',
                }
            })
        }

        const messages = await this.messageRepository.paginateForDiscussion(discussion.id, 15)

        return res.json({
            data: messages.map(message => {
                return {
                    id: message.id,
                    discussion_id: message.discussion_id,
                    customer_id: message.sender_id,
                    type: 'message',
                    content: message.content,
                    created_at: message.created_at,
                    read_at: message.read_at,
                }
            })
        })
    }
}
