import { IsString } from 'class-validator';

export class ImageDto {
  @IsString()
  name: string;

  @IsString()
  extension: string;

  @IsString()
  path: string;
}

export interface ImageIdDto {
  id: string;
}
