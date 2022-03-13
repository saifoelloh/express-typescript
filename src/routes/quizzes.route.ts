import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import QuizController from '@/controllers/quizzes.controller';
import { CreateQuizDto } from '@/dtos/quizzes.dto';

class QuizzesRoute implements Routes {
  readonly path = '/quizzes';
  readonly router = Router();
  readonly quizController = new QuizController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.quizController.getQuizById);
    this.router.post(
      `${this.path}`,
      authMw(),
      validationMiddleware(CreateQuizDto, 'body'),
      this.quizController.createQuiz,
    );
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      validationMiddleware(CreateQuizDto, 'body', true),
      this.quizController.updateQuiz,
    );
    this.router.delete(`${this.path}/:id`, authMw(), this.quizController.deleteQuiz);
  }
}

export default QuizzesRoute;
