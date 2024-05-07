// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function processQuestion(prompt: {
//   content: string;
// }): Promise<string> {
//   const message = {
//     role: 'user',
//     content: prompt.content,
//   };

//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [message],
//     temperature: 0.3,
//     max_tokens: 10,
//     top_p: 1.0,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//   });

//   if (response && response.choices && response.choices[0].message.content) {
//     return response.choices[0].message.content;
//   } else {
//     // Se não houver conteúdo retornado, retorna uma string vazia
//     return '';
//   }
// }
