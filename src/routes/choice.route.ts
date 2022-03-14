import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import ChapterController from '@/controllers/chapters.controller';
import { CreateChoiceDto } from '@/dtos/choice.dto';

class ChoicesRoute implements Routes {
  public path = '/choice';
  public router = Router();
  public chapterController = new ChapterController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.chapterController.getChapters);
    this.router.get(`${this.path}/:id`, this.chapterController.getChapterById);
    this.router.post(
      `${this.path}`,
      authMw(),
      validationMiddleware(CreateChoiceDto, 'body'),
      this.chapterController.createChapter,
    );
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      validationMiddleware(CreateChoiceDto, 'body', true),
      this.chapterController.updateChapter,
    );
    this.router.delete(`${this.path}/:id`, authMw(), this.chapterController.deleteChapter);
  }
}

export default ChoicesRoute;
