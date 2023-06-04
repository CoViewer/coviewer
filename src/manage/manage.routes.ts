import { Routes } from '@nestjs/core';
import { StorageModule } from './storage/storage.module';
import { TempModule } from './temp/temp.module';
import { ComicModule } from './comic/comic.module';
import { comicRoutes } from './comic/comic.routes';

export const manageRoutes: Routes = [
  {
    path: 'storage',
    module: StorageModule,
  },
  {
    path: 'temp',
    module: TempModule,
  },
  {
    path: 'comic',
    module: ComicModule,
    children: comicRoutes,
  },
];
