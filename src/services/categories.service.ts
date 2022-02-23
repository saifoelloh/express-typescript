import { PrismaClient, Category, Prisma } from '@prisma/client';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Pagination } from '@/interfaces/query.interface';

class CategoryService {
  public categories = new PrismaClient().category;

  public async findAllCategory(pagination: Pagination<Category>, filter: Prisma.CategoryWhereInput = {}): Promise<Category[]> {
    const { show = 10, page = 0, orderBy = [{ name: 'desc' }] } = pagination;
    const allCategory: Category[] = await this.categories.findMany({
      skip: show * page,
      take: show,
      orderBy: orderBy,
      where: filter,
    });
    return allCategory;
  }

  public async findCategoryById(categoryId: string): Promise<Category> {
    if (isEmpty(categoryId)) throw new HttpException(400, "You're not categoryId");

    const findCategory: Category = await this.categories.findFirst({ where: { id: categoryId } });
    if (!findCategory) throw new HttpException(409, "You're not category");

    return findCategory;
  }

  public async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    if (isEmpty(categoryData)) throw new HttpException(400, "You're not categoryData");

    const findCategory: Category = await this.categories.findUnique({ where: { name: categoryData.name } });
    if (findCategory) throw new HttpException(409, `This category ${categoryData.name} already exists`);

    const createCategoryData: Category = await this.categories.create({ data: categoryData });
    return createCategoryData;
  }

  public async updateCategory(categoryId: string, categoryData: CreateCategoryDto): Promise<Category> {
    if (isEmpty(categoryData)) throw new HttpException(400, "You're not categoryData");

    const findCategory: Category = await this.categories.findUnique({ where: { id: categoryId } });
    if (!findCategory) throw new HttpException(409, "You're not category");

    const updateCategoryData = await this.categories.update({ where: { id: categoryId }, data: categoryData });
    return updateCategoryData;
  }

  public async deleteCategory(categoryId: string): Promise<Category> {
    if (isEmpty(categoryId)) throw new HttpException(400, "You're not categoryId");

    const findCategory: Category = await this.categories.findUnique({ where: { id: categoryId } });
    if (!findCategory) throw new HttpException(409, "You're not category");

    const deleteCategoryData = await this.categories.delete({ where: { id: categoryId } });
    return deleteCategoryData;
  }
}

export default CategoryService;
