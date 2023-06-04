import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicTag } from 'src/entity/comic-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComicTag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
