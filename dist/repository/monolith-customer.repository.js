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
exports.getCustomerCount = exports.chunkById = void 0;
const promise_1 = require("mysql2/promise");
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, promise_1.createConnection)({
            host: '0.0.0.0',
            port: 3306,
            user: 'dev',
            password: 'dev',
            database: 'luxe',
        });
    });
}
function chunkById(lastId, limit = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield getConnection();
        let [rows, _] = yield connection.query(`
        SELECT customer_id,
               customer_uuid,
               customer_firstname,
               customer_lastname,
               customer_email,
               customer_password,
               customer_created
        FROM customers
        WHERE customer_id > ${lastId}
        ORDER BY customer_id ASC LIMIT ${limit}
    `);
        connection.end();
        return rows;
    });
}
exports.chunkById = chunkById;
function getCustomerCount() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield getConnection();
        let [rows, _] = yield connection.query('SELECT COUNT(*) as customerCount FROM customers');
        connection.end();
        return rows[0].customerCount;
    });
}
exports.getCustomerCount = getCustomerCount;
