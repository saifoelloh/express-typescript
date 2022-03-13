import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { Quiz } from '@prisma/client';

import { HttpException } from '@/exceptions/HttpException';
import QuizService from '@/services/quizzes.service';
import { CreateQuizDto } from '@/dtos/quizzes.dto';

class QuizController {
  private readonly quizService = new QuizService();

  public getQuizById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quiz: Quiz = await this.quizService.findQuizBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(quiz)) throw new HttpException(404, 'Not Found');

      res.status(200).json({ data: quiz, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateQuizDto;
    try {
      const course: Quiz = await this.quizService.createQuiz(body);
      res.status(201).json({ data: course, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateQuizDto;
    try {
      const findQuiz: Quiz = await this.quizService.findQuizBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findQuiz)) throw new HttpException(404, 'Not Found');

      const quiz: Quiz = await this.quizService.updateQuizById(findQuiz.id, body);
      res.status(200).json({ data: quiz, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findQuiz: Quiz = await this.quizService.findQuizBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findQuiz)) throw new HttpException(404, 'Not Found');

      await this.quizService.deleteQuizById(findQuiz.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default QuizController;
