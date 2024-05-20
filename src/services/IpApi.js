"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIp = void 0;
const getIp = (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(ip);
    res.json({ ip });
};
exports.getIp = getIp;
