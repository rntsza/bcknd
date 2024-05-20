"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError {
    constructor(message, statusCode = 300) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.default = AppError;
