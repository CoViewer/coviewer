import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { TempModule } from './temp/temp.module';

@Module({
  imports: [StorageModule, TempModule],
  controllers: [],
  providers: [],
})
export class ManageModule {}
