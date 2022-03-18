import { IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID('4')
  userId: string;
}
