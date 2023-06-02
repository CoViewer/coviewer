import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from 'src/entity/storage.entity';
import { Comic } from 'src/entity/comic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Storage, Comic])],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
