import { Module } from '@nestjs/common';
import { ComicController } from './comic.controller';
import { ComicService } from './comic.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comic } from 'src/entity/comic.entity';
import { Temp } from 'src/entity/temp.entity';
import { Image } from 'src/entity/image.entity';
import { Storage } from 'src/entity/storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comic, Temp, Storage, Image]), TagModule],
  controllers: [ComicController],
  providers: [ComicService],
})
export class ComicModule {}
