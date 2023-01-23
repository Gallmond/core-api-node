import { Customer, CustomerDiscussion, Message, Trip, Discussion } from '@prisma/client'
import HTTPException from 'exceptions/HTTPException'
import type { RequestHandler } from 'express'
import { FilteredCustomer } from 'middleware/JWTAuth'
import CustomerDiscussionRepository from 'repository/CustomerDiscussionRepository'
import Prisma from 'repository/Prisma'
import BaseController from './BaseController'

type CustomerDiscussionsWithRelations = (CustomerDiscussion & {
    discussion: Discussion & {
        initiator: Customer;
        messages: Message[];
        trips: Trip[];
        customer_discussions: (CustomerDiscussion & {
            customer: Customer
        })[];
}})

class DiscussionController extends BaseController{

    /** //TODO make this into like resources? */
    private tripJson = (trip: Trip): object => {
        return {
            id: trip.id,
            start: trip.start,
            end: trip.end,
            property: {
                id: trip.property_id,
                location_summary: ''
            }
        }
    }

    /** //TODO make this into like resources? */
    private discussionUserJson = (customerDiscussion: CustomerDiscussion & {customer: Customer}) => {
        return {
            id: customerDiscussion.customer.id,
            first_name: customerDiscussion.customer.first_name,
            last_name: customerDiscussion.customer.last_name,
            avatar: customerDiscussion.customer.avatar,
            agreed_at: customerDiscussion.agreed_at
        }
    }

    /** //TODO make this into like resources? */
    private formatCustomerDiscussions = (thisCustomer: FilteredCustomer, customerDiscussions: CustomerDiscussionsWithRelations[]) => {
        return customerDiscussions.map(element => {
    
            // collect information about all users in this discussion
            const discussionUsers: Record<string, object> = {}
            element.discussion.customer_discussions.forEach(customerDiscussion => {
                discussionUsers[customerDiscussion.customer_id] = this.discussionUserJson(customerDiscussion)
            })
    
            // get the 'other' user
            const otherUserId = Object.keys( discussionUsers ).filter(id => id !== thisCustomer.id).shift()
            const otherUser = otherUserId ? discussionUsers[ otherUserId ] : undefined
    
            // get latest message and unread count
            let latestMessage: Message | undefined
            let unreadMessageCount = 0
            for(let i = 0,l = element.discussion.messages.length; i < l; i++){
                const message = element.discussion.messages[i]
    
                if(message.read_at === null){
                    unreadMessageCount++
                }
    
                if(
                    latestMessage === undefined
                    || message.created_at > latestMessage.created_at
                ){
                    latestMessage = message
                }
    
            }
    
            // format trip
            const thisCustomerTrip = element.discussion.trips.pop()
            const formattedTrip = thisCustomerTrip ? this.tripJson(thisCustomerTrip) : undefined
    
            // format response
            return {
                id: element.id,
                state: element.discussion.state,
                type: element.discussion.type,
                unread_message_count: unreadMessageCount,
                user: discussionUsers[thisCustomer.id],
                other_user: otherUser,
                trip: formattedTrip,
                latest_message: {
                    sender_id: latestMessage?.sender_id,
                    content: latestMessage?.content,
                    created_at: latestMessage?.created_at,
                    read_at: latestMessage?.read_at,
                },
                updated_at: element.discussion.updated_at,
                created_at: element.discussion.created_at,
            }
        })
    }

    getDiscussions: RequestHandler = async (req, res, next) => {
    
        const thisCustomer = this.authenticatedCustomer(req)
        
        if(!thisCustomer){
            next(new HTTPException(401, 'Not an authorised customer'))
            return
        }
    
        const skip = req.body.skip ?? 0
        const take = req.body.take ?? 20
    
        const customerDiscussionsRepo = new CustomerDiscussionRepository(Prisma.client)
    
        const customerDiscussionsCount = await customerDiscussionsRepo.getCustomerDiscussionsCountForCustomer(thisCustomer.id)
        const customerDiscussions = await customerDiscussionsRepo.getCustomerDiscussionsForCustomer(thisCustomer.id, skip, take)
        const formatted = this.formatCustomerDiscussions(thisCustomer, customerDiscussions)
    
        res.json({
            data: formatted,
            pagination: {
                total: customerDiscussionsCount,
                skip,
                take,
            }
        }).end()
    }

}

export default new DiscussionController()
