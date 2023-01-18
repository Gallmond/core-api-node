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
exports.processRows = void 0;
function processRows(prisma, rows) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.customer.createMany({
                data: rows.map(row => ({
                    id: row.customer_uuid,
                    first_name: row.customer_firstname,
                    last_name: row.customer_lastname,
                    email: row.customer_email,
                    password: row.customer_password,
                    created_at: row.customer_created,
                })),
                skipDuplicates: true,
            });
            prisma.$disconnect();
        }
        catch (err) {
            console.error(err);
            prisma.$disconnect();
        }
        return rows.length;
    });
}
exports.processRows = processRows;
