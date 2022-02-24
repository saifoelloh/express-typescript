import { NextFunction, Request, Response } from 'express';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from '@dtos/categories.dto';
import CategoryService from '@services/categories.service';

class CategoriesController {
  public categoryService = new CategoryService();

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {},
        filter = {};
      if (req.query?.pagination) {
        pagination = JSON.parse(req.query.pagination);
      }

      if (req.query?.filter) {
        filter = JSON.parse(req.query.filter);
      }

      const findAllCategorysData: Category[] = await this.categoryService.findAllCategory(pagination, filter);

      res.status(200).json({ data: findAllCategorysData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findOneCategoryData: Category = await this.categoryService.findCategoryById(req.params.id);

      res.status(200).json({ data: findOneCategoryData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateCategoryDto = req.body;
      const createCategoryData: Category = await this.categoryService.createCategory(userData);

      res.status(201).json({ data: createCategoryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateCategoryDto = req.body;
      const updateCategoryData: Category = await this.categoryService.updateCategory(req.params.id, userData);

      res.status(200).json({ data: updateCategoryData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleteCategoryData: Category = await this.categoryService.deleteCategory(req.params.id);

      res.status(200).json({ data: deleteCategoryData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoriesController;
