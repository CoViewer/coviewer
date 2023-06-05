import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Body,
} from '@nestjs/common';
import { Comic } from 'src/entity/comic.entity';
import { ComicService } from './comic.service';
import { ComicQuery } from './comic.dto';

@Controller()
export class ComicController {
  constructor(private comicService: ComicService) {}

  @Get('list')
  getComicList(
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<Comic[]> {
    return this.comicService.getComicList(pageSize, offset);
  }

  @Get('detail')
  getComicDetail(@Query('id', ParseIntPipe) id: number): Promise<Comic> {
    return this.comicService.getComicDetail(id);
  }

  @Post('add')
  addComic(@Body() data: Comic) {
    return this.comicService.addComic(data);
  }

  @Delete('delete')
  deleteComic(@Body() data: ComicQuery ): Promise<object> {
    return this.comicService.deleteComic(data.id);
  }
}
