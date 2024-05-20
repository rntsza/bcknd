"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMiddleware = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const prismaMiddleware = (req, res, next) => {
    console.log(`Passando pelo Middleware 🐱‍👤🐱‍🐉🐱‍💻🐱‍👓🐱‍🚀 - Method: ${req.method} Endpoint: ${req.url} `);
    req.prisma = prisma;
    next();
};
exports.prismaMiddleware = prismaMiddleware;
