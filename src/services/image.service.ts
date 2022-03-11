import { ImageDto } from '@/dtos/image.dto';
import { HttpException } from '@/exceptions/HttpException';
import { FindOneOption } from '@/interfaces/shared.interface';
import { Image, PrismaClient } from '@prisma/client';
import _ from 'lodash';
import UserService from './users.service';

class ImageService {
  readonly image = new PrismaClient().image;
  readonly userService = new UserService();

  public async findImageBy(option: FindOneOption<Image>): Promise<Image> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const image = await this.image.findFirst({ where: { [key]: value } });
    return image;
  }

  public async createImage(data: ImageDto): Promise<Image> {
    if (_.isEmpty(data)) throw new HttpException(400, 'Bad Request');
    const image = await this.image.create({ data });
    return image;
  }

  public async updateImage(imageId: string, imageDto: ImageDto): Promise<Image> {
    if (_.isEmpty(imageDto)) throw new HttpException(400, 'Bad Request');
    const updatedImage = await this.image.update({ where: { id: imageId }, data: imageDto });
    return updatedImage;
  }

  public async deleteImage(imageId: string): Promise<void> {
    if (_.isEmpty(imageId)) throw new HttpException(400, 'Bad Request');
    await this.image.delete({ where: { id: imageId } });
  }
}

export default ImageService;
