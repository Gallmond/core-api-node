import CustomerDiscussionRepository from "../repository/CustomerDiscussionRepository";
import {IMonolithCustomerDiscussion} from "../types/MonolithCustomerDiscussion";
import {ICustomerDiscussionDTO} from "../types/CustomerDiscussionDTO";

export default class MonolithCustomerDiscussionService {
    #customerDiscussionRepository: CustomerDiscussionRepository;

    constructor(customerDiscussionRepository: CustomerDiscussionRepository) {
        this.#customerDiscussionRepository = customerDiscussionRepository;
    }

    async processRows(rows: IMonolithCustomerDiscussion[]): Promise<number> {
        const customerDiscussionDTOs: ICustomerDiscussionDTO[] = rows.map(row => {
            return {
                id: row.link_uuid,
                customerId: row.customer_uuid,
                discussionId: row.discussion_uuid,
                createdAt: row.link_created,
                agreedAt: row.link_agreed === 'true' ? row.link_updated: null,
                deletedAt: row.link_status === 'deleted' ? row.link_updated : null,
            }
        })

        return await this.#customerDiscussionRepository.createManyFromDto(customerDiscussionDTOs);
    }
}