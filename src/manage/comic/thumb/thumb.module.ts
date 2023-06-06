import { Module } from '@nestjs/common';
import { ThumbService } from './thumb.service';
import { ThumbController } from './thumb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thumb } from 'src/entity/thumb.entity';
import { Comic } from 'src/entity/comic.entity';
import { Image } from 'src/entity/image.entity';
import {
  StorageDriverFactory,
  StorageService,
} from 'src/manage/storage/storage.service';
import { Storage } from 'src/entity/storage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comic, Image, Storage]),
    TypeOrmModule.forFeature([Thumb], 'thumb'),
  ],
  providers: [ThumbService, StorageService, StorageDriverFactory],
  controllers: [ThumbController],
})
export class ThumbModule {}
