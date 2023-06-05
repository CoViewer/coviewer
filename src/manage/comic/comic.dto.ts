import { IsEmpty, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ComicQuery {
    @IsNumber()
    @IsNotEmpty()
    id: number;
  }