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
exports.processQuestion = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function processQuestion(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = {
            role: 'user',
            content: prompt.content,
        };
        // const response = await openai.chat.completions.create({
        //   // model: 'gpt-3.5-turbo',
        //   // messages: ['message'],
        //   // temperature: 0.3,
        //   // max_tokens: 10,
        //   // top_p: 1.0,
        //   // frequency_penalty: 0,
        //   // presence_penalty: 0,
        // });
        // if (response && response.choices && response.choices[0].message.content) {
        //   return response.choices[0].message.content;
        // } else {
        //   // Se não houver conteúdo retornado, retorna uma string vazia
        //   return '';
        // }
    });
}
exports.processQuestion = processQuestion;
