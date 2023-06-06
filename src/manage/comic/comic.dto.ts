import { IsEmpty, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ComicDto {
  id: number;
  title: string;
  tags: number[];
  publishDate?: Date;
  // uploadTime?: Date;
  storage: number;
  path: string;
  images: string[];
  cover: string;
  // view?: number;
}

export class ComicQuery {
    @IsNumber()
    @IsNotEmpty()
    id: number;
  }