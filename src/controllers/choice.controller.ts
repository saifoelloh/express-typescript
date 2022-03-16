import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { Choice } from '@prisma/client';

import { HttpException } from '@/exceptions/HttpException';
import { Pagination } from '@/interfaces/shared.interface';
import ChoiceService from '@/services/choice.service';
import { CreateChoiceDto } from '@/dtos/choice.dto';

class ChoiceController {
  private readonly choiceService = new ChoiceService();

  public getChoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {};
      if (req.query?.pagination) {
        pagination = JSON.parse(req.query.pagination as string);
      }

      let filter = {};
      if (req.query?.filter) {
        filter = JSON.parse(req.query.filter as string);
      }

      const chapters: [Choice[], number] = await this.choiceService.findAllChoice(
        pagination as Pagination<Choice>,
        filter,
      );
      res.status(200).json({ data: chapters, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getChoiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const choice: Choice = await this.choiceService.findChoiceBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(choice)) throw new HttpException(404, 'Not Found');

      res.status(200).json({ data: choice, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createChoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateChoiceDto;
    try {
      const choice: Choice = await this.choiceService.createChoice(body);
      res.status(201).json({ data: choice, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateChoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateChoiceDto;
    try {
      const findChoice: Choice = await this.choiceService.findChoiceBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findChoice)) throw new HttpException(404, 'Not Found');

      const choice: Choice = await this.choiceService.updateChoice(findChoice.id, body);
      res.status(200).json({ data: choice, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteChoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findChoice: Choice = await this.choiceService.findChoiceBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findChoice)) throw new HttpException(404, 'Not Found');

      await this.choiceService.deleteChoice(findChoice.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default ChoiceController;
