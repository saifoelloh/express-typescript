import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { Order, User } from '@prisma/client';

import { HttpException } from '@/exceptions/HttpException';
import { Pagination } from '@/interfaces/shared.interface';
import { CreateOrderDto } from '@/dtos/orders.dto';
import OrderService from '@/services/order.service';

class OrderController {
  private readonly orderService = new OrderService();

  public getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userOrder: User = await this.orderService.findAllOrder(req.params.userId);
      res.status(200).json({ data: userOrder.orders, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order: Order = await this.orderService.findOrderBy({
        key: 'id',
        value: req.params.orderId,
      });
      if (_.isEmpty(order)) throw new HttpException(404, 'Not Found');

      res.status(200).json({ data: order, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const orderData = req.body.order as CreateOrderDto;
    try {
      const choice: Order = await this.orderService.createOrder(orderData);
      res.status(201).json({ data: choice, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateChoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateOrderDto;
    try {
      const findChoice: Order = await this.orderService.findOrderBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findChoice)) throw new HttpException(404, 'Not Found');

      const choice: Order = await this.orderService.updateOrder(findChoice.id, body);
      res.status(200).json({ data: choice, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteChoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findChoice: Order = await this.orderService.findOrderBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findChoice)) throw new HttpException(404, 'Not Found');

      await this.orderService.deleteOrder(findChoice.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
