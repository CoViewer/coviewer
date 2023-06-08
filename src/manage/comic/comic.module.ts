import { Module } from '@nestjs/common';
import { ComicController } from './comic.controller';
import { ComicService } from './comic.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comic } from 'src/entity/comic.entity';
import { Temp } from 'src/entity/temp.entity';
import { Image } from 'src/entity/image.entity';
import { Storage } from 'src/entity/storage.entity';
import { ThumbModule } from './thumb/thumb.module';
import { ThumbService } from './thumb/thumb.service';
import { Thumb } from 'src/entity/thumb.entity';
import {
  StorageDriverFactory,
  StorageService,
} from '../storage/storage.service';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comic, Temp, Storage, Image]),
    TypeOrmModule.forFeature([Thumb], 'thumb'),
    TagModule,
    ThumbModule,
    ImportModule,
  ],
  controllers: [ComicController],
  providers: [ComicService, ThumbService, StorageService, StorageDriverFactory],
})
export class ComicModule {}
