import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import { CreateChapterDto } from '@/dtos/chapters.dto';
import ChoiceController from '@/controllers/choice.controller';

class ChaptersRoute implements Routes {
  public path = '/choices';
  public router = Router();
  public chapterController = new ChoiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.chapterController.getChoices);
    this.router.get(`${this.path}/:id`, this.chapterController.getChoiceById);
    this.router.post(
      `${this.path}`,
      authMw(),
      validationMiddleware(CreateChapterDto, 'body'),
      this.chapterController.createChoice,
    );
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      validationMiddleware(CreateChapterDto, 'body', true),
      this.chapterController.updateChoice,
    );
    this.router.delete(`${this.path}/:id`, authMw(), this.chapterController.deleteChoice);
  }
}

export default ChaptersRoute;
