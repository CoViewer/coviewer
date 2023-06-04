import { HttpException, Injectable } from '@nestjs/common';
import { ComicTag } from 'src/entity/comic-tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ComicTagDto } from './tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(ComicTag) private readonly comicTag: Repository<ComicTag>,
  ) {}

  async getTagList(): Promise<ComicTag[]> {
    return await this.comicTag.find();
  }

  async addTag(data: ComicTagDto): Promise<ComicTag> {
    return await this.comicTag.save(data);
  }

  async updateTag(data: ComicTagDto): Promise<object> {
    const result = await this.comicTag.update(data.id, data);
    if (result.affected == 0) throw new HttpException('Tag not found', 404);
    return {};
  }

  async deleteTag(id: number): Promise<object> {
    const result = await this.comicTag.delete(id);
    if (result.affected == 0) throw new HttpException('Tag not found', 404);
    return {};
  }
}
