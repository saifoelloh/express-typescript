import { Router } from 'express';
import CategoriesController from '@controllers/categories.controller';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class CategoriesRoute implements Routes {
  public path = '/categories';
  public router = Router();
  public categoriesController = new CategoriesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.categoriesController.getCategories);
    this.router.get(`${this.path}/:id`, this.categoriesController.getCategoryById);
    this.router.post(`${this.path}`, authMiddleware(), validationMiddleware(CreateCategoryDto, 'body'), this.categoriesController.createCategory);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware(),
      validationMiddleware(CreateCategoryDto, 'body', true),
      this.categoriesController.updateCategory,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware(), this.categoriesController.deleteCategory);
  }
}

export default CategoriesRoute;
