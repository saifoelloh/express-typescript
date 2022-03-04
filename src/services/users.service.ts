import { Prisma, PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { Pagination } from '@/interfaces/shared.interface';
import { FindOneOption } from '@/interfaces/shared.dto';
import * as _ from 'lodash';

class UserService {
  public users = new PrismaClient().user;

  public async findAllUser(pagination: Pagination<User>, filter: Prisma.CategoryWhereInput = {}): Promise<[User[], number]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const users: User[] = await this.users.findMany({
      skip: show * page,
      take: show,
      orderBy: orderBy,
      where: filter,
    });
    const total = await this.users.count({ where: filter });
    return [users, total];
  }

  public async findUserBy(option: FindOneOption<User>): Promise<User> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const findUser: User = await this.users.findUnique({ where: { [key]: value } });
    return findUser;
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    if (_.isEmpty(data)) throw new HttpException(400, 'Bad Request');

    const createUserData = await this.users.create({ data });
    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (_.isEmpty(userData)) throw new HttpException(400, 'Bad Request');

    const updateUserData = await this.users.update({ where: { id: userId }, data: userData });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (_.isEmpty(userId)) throw new HttpException(400, 'Bad Request');

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return deleteUserData;
  }
}

export default UserService;
