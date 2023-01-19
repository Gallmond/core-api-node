import {IMonolithCustomer} from "../types/MonolithCustomer";
import CustomerRepository from "../repository/CustomerRepository";

export default class MonolithCustomerService {
    #customerRepository: CustomerRepository;

    constructor(customerRepository: CustomerRepository) {
        this.#customerRepository = customerRepository;
    }

    async processRows(rows: IMonolithCustomer[]): Promise<number> {
        return await this.#customerRepository.createManyFromMonolithCustomers(rows);
    }
}