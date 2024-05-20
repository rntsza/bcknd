import { Router } from 'express';
import AuthenticateUserService from '../services/AuhenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    console.log(request.body)
    console.log(email, password)
    const authenticateUser = new AuthenticateUserService();

    const { advogado, token } = await authenticateUser.execute({
      email,
      password,
    });

    const { userId, nome, createdAt, email: advogadoEmail } = advogado;
    const advogadoResponse = { userId, nome, createdAt, email: advogadoEmail };

    return response.json({ advogado: advogadoResponse, token });
  } catch (err: any) {
    return response.status(err.statusCode).json({ error: err.message });
  }
});

export default sessionsRouter;
