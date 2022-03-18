import * as _ from 'lodash';
import { Prisma, PrismaClient, Order, User } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import { CreateOrderDto } from '@/dtos/orders.dto';

class OrderService {
  readonly prisma = new PrismaClient();
  readonly order = this.prisma.order;
  readonly user = this.prisma.user;

  public async findAllOrder(userId: string): Promise<User> {
    const userOrder = await this.user.findFirst({
      where: { id: userId },
      includes: { orders: true },
    });

    return userOrder;
  }

  public async findOrderBy(option: FindOneOption<Order>): Promise<Order> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const order = await this.order.findFirst({
      where: { [key]: value },
      includes: { user: true },
    });
    return order;
  }

  public async createOrder(data: CreateOrderDto): Promise<Order> {
    if (_.isEmpty(data)) throw new HttpException(400, "You're not course");

    const order = await this.order.create({ data });
    return order;
  }

  public async updateOrder(choiceId: string, data: CreateOrderDto): Promise<Order> {
    if (_.isEmpty(data)) throw new HttpException(400, "You're not courseData");

    const updatedOrder = await this.order.update({
      where: { id: choiceId },
      data: data,
    });
    return updatedOrder;
  }

  public async deleteOrder(choiceId: string): Promise<Order> {
    if (_.isEmpty(choiceId)) throw new HttpException(400, 'Bad Request');

    const deletedOrder = await this.order.delete({ where: { id: choiceId } });
    return deletedOrder;
  }
}

export default OrderService;
