import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import DiscussionRepository from "../repository/DiscussionRepository";

export default class MonolithDiscussionService {
    #discussionRepository: DiscussionRepository;

    constructor(discussionRepository: DiscussionRepository) {
        this.#discussionRepository = discussionRepository;
    }

    async processRows(rows: IMonolithDiscussion[]): Promise<number> {
        return await this.#discussionRepository.createManyFromMonolithDiscussions(rows);
    }
}