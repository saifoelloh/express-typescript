import { ImageDto } from '@/dtos/image.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Image, PrismaClient } from '@prisma/client';
import _ from 'lodash';
import UserService from './users.service';

export class ImageService {
  readonly image = new PrismaClient().image;
  readonly userService = new UserService();

  public async createImage(data: ImageDto): Promise<Image> {
    if (_.isEmpty(data)) throw new HttpException(400, 'Bad Request');
    const image = await this.image.create({ data });
    return image;
  }
}
