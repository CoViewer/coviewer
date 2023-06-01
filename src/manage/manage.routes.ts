import { Routes } from '@nestjs/core';
import { StorageModule } from './storage/storage.module';

export const manageRoutes: Routes = [
  {
    path: 'storage',
    module: StorageModule,
  },
];