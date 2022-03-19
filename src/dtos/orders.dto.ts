import { IsUUID, IsEnum } from 'class-validator';
import { PAYMENT_METHODS } from '@prisma/client';

export class CreateOrderDto {
  @IsUUID('4')
  userId: string;

  @IsEnum(PAYMENT_METHODS)
  payment: PAYMENT_METHODS;
}
