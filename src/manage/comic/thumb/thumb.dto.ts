import { IsNotEmpty, IsNumber } from 'class-validator';

export class ThumbQuery {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
