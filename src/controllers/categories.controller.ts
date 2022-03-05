import { NextFunction, Request, Response } from 'express';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from '@dtos/categories.dto';
import CategoryService from '@services/categories.service';
import { Pagination } from '@/interfaces/shared.interface';
import _ from 'lodash';
import { HttpException } from '@/exceptions/HttpException';

class CategoriesController {
  public categoryService = new CategoryService();

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {};
      if (req.query?.pagination) {
        pagination = JSON.parse(req.query.pagination as string);
      }

      let filter = {};
      if (req.query?.filter) {
        filter = JSON.parse(req.query.filter as string);
      }

      const data = await this.categoryService.findAllCategory(pagination as Pagination<Category>, filter);
      res.status(200).json({ data, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCategory = await this.categoryService.findCategoryBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCategory)) throw new HttpException(404, 'Not Found');

      res.status(200).json({ data: findCategory, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateCategoryDto;

    try {
      const findCategory = await this.categoryService.findCategoryBy({ key: 'name', value: body.name });
      if (!_.isEmpty(findCategory)) throw new HttpException(409, 'Conflict');

      const data = await this.categoryService.createCategory(body);
      res.status(201).json({ data, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateCategoryDto;

    try {
      const findCategory = await this.categoryService.findCategoryBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCategory)) throw new HttpException(404, 'Not Found');

      const data = await this.categoryService.updateCategory(findCategory.id, body);
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCategory = await this.categoryService.findCategoryBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCategory)) throw new HttpException(404, 'Not Found');

      const data = await this.categoryService.deleteCategory(req.params.id);
      res.status(200).json({ data, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoriesController;
