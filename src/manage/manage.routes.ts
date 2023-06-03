import { Routes } from '@nestjs/core';
import { StorageModule } from './storage/storage.module';
import { TempModule } from './temp/temp.module';

export const manageRoutes: Routes = [
  {
    path: 'storage',
    module: StorageModule,
  },
  {
    path: 'temp',
    module: TempModule,
  },
];
