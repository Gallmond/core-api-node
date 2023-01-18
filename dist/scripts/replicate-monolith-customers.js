"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const monolith_customer_repository_1 = require("../repository/monolith-customer.repository");
const monolith_customer_service_1 = require("../services/monolith-customer.service");
const client_1 = require("@prisma/client");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient();
        const total = yield (0, monolith_customer_repository_1.getCustomerCount)();
        let lastId = 1000;
        let processed = 0;
        while (processed < total) {
            try {
                const monolithCustomerRows = yield (0, monolith_customer_repository_1.chunkById)(lastId);
                const processedRows = yield (0, monolith_customer_service_1.processRows)(prisma, monolithCustomerRows);
                lastId += 1000;
                processed += processedRows;
                console.log(`Processed ${processed}/${total} rows`);
            }
            catch (err) {
                console.error(err);
            }
        }
    });
}
main()
    .then(() => console.log('Processed all customers'))
    .catch(err => console.error(err));
