import { PrismaClient, Category, Prisma } from '@prisma/client';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import * as _ from 'lodash';

class CategoryService {
  public categories = new PrismaClient().category;

  public async findAllCategory(pagination: Pagination<Category>, filter: Prisma.CategoryWhereInput = {}): Promise<[Category[], number]> {
    const { show = 10, page = 0, orderBy = [{ name: 'desc' }] } = pagination;
    const categories: Category[] = await this.categories.findMany({
      skip: show * page,
      take: show,
      orderBy: orderBy,
      where: filter,
    });
    const total = await this.categories.count({ where: filter });
    return [categories, total];
  }

  public async findCategoryBy(option: FindOneOption<Category>): Promise<Category> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const category = await this.categories.findUnique({ where: { [key]: value } });
    return category;
  }

  public async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    if (_.isEmpty(categoryData)) throw new HttpException(400, 'Bad Request');

    const findCategory: Category = await this.categories.findUnique({ where: { name: categoryData.name } });
    if (findCategory) throw new HttpException(409, 'Conflict');

    const createCategoryData: Category = await this.categories.create({ data: categoryData });
    return createCategoryData;
  }

  public async updateCategory(categoryId: string, categoryData: CreateCategoryDto): Promise<Category> {
    if (_.isEmpty(categoryData)) throw new HttpException(400, 'Bad Request');

    const updateCategoryData = await this.categories.update({ where: { id: categoryId }, data: categoryData });
    return updateCategoryData;
  }

  public async deleteCategory(categoryId: string): Promise<Category> {
    if (_.isEmpty(categoryId)) throw new HttpException(400, 'Bad Request');

    const deleteCategoryData = await this.categories.delete({ where: { id: categoryId } });
    return deleteCategoryData;
  }
}

export default CategoryService;
