import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ThumbService } from './thumb.service';
import { ThumbQuery } from './thumb.dto';

@Controller()
export class ThumbController {
  constructor(private thumbService: ThumbService) {}

  @Post('update')
  updateComicThumb(@Body() data: ThumbQuery): Promise<string[]> {
    return this.thumbService.updateComicThumb(data.id);
  }

  @Post('update_images')
  updateImagesThumb(@Body() data: string[]): Promise<string[]> {
    return this.thumbService.updateImagesThumb(data);
  }
}
