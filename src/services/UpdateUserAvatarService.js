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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const upload_1 = __importDefault(require("../config/upload"));
const fs_1 = __importDefault(require("fs"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma = new client_1.PrismaClient();
class UpdateUserAvatarService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, avatarFilename, }) {
            const userRepository = yield prisma.advogado.findFirst({
                where: {
                    userId: userId,
                },
            });
            if (!userRepository) {
                throw new AppError_1.default('Only authenticated users can change avatar.', 401);
            }
            if (userRepository.avatar) {
                const userAvatarFilePath = path_1.default.join(upload_1.default.directory, userRepository === null || userRepository === void 0 ? void 0 : userRepository.avatar);
                const userAvatarFileExistis = yield fs_1.default.promises.stat(userAvatarFilePath);
                if (userAvatarFileExistis) {
                    yield fs_1.default.promises.unlink(userAvatarFilePath);
                }
            }
            userRepository.avatar = avatarFilename;
            yield prisma.advogado.update({
                where: {
                    id: userRepository.id,
                },
                data: {
                    avatar: avatarFilename,
                },
            });
            return userRepository;
        });
    }
}
exports.default = UpdateUserAvatarService;
