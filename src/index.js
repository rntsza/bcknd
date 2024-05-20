"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const prismaMiddleware_1 = require("./middlewares/prismaMiddleware");
// import ensureAuthenticated from './middlewares/ensureAuthenticated';
const cors_1 = __importDefault(require("cors"));
const IpApi_1 = require("./services/IpApi");
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://google.com',
    '*'
];
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Origin', origin);
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
const app = (0, express_1.default)();
const port = process.env.PORT || 3333;
app.use(express_1.default.json());
app.use(prismaMiddleware_1.prismaMiddleware);
app.use((0, cors_1.default)(corsOptions));
app.use(routes_1.default);
app.get('/ip', IpApi_1.getIp);
// app.use(ensureAuthenticated);
app.listen(port, () => {
    console.log(`[server]: 👀 Server is running at http://localhost:${port} 👀`);
});
