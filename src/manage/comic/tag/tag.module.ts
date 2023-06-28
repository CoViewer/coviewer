import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicTag } from 'src/entity/comic-tag.entity';
import { ComicTagRule } from 'src/entity/comic-tag-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComicTag, ComicTagRule])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
