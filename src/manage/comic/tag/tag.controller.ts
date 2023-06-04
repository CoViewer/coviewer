import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { TagService } from './tag.service';
import { ComicTag } from 'src/entity/comic-tag.entity';
import { ComicTagDto, ComicTagQuery } from './tag.dto';

@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('list')
  async getTagList(): Promise<ComicTag[]> {
    return await this.tagService.getTagList();
  }

  @Post('add')
  async addTag(@Body() data: ComicTagDto): Promise<ComicTag> {
    return await this.tagService.addTag(data);
  }

  @Put('update')
  async updateTag(@Body() data: ComicTagDto): Promise<object> {
    return await this.tagService.updateTag(data);
  }

  @Delete('delete')
  async deleteTag(@Body() data: ComicTagQuery): Promise<object> {
    return await this.tagService.deleteTag(data.id);
  }
}
