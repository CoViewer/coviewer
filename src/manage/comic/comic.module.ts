import { Module } from '@nestjs/common';
import { ComicController } from './comic.controller';
import { ComicService } from './comic.service';
import { TagModule } from './tag/tag.module';

@Module({
  controllers: [ComicController],
  providers: [ComicService],
  imports: [TagModule]
})
export class ComicModule {}
