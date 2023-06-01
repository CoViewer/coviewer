import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from 'src/entity/storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
