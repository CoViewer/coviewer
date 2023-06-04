import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { TempModule } from './temp/temp.module';
import { ComicModule } from './comic/comic.module';

@Module({
  imports: [StorageModule, TempModule, ComicModule],
  controllers: [],
  providers: [],
})
export class ManageModule {}
