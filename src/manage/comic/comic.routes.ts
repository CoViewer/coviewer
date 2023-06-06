import { Routes } from '@nestjs/core';
import { TagModule } from './tag/tag.module';
import { ThumbModule } from './thumb/thumb.module';

export const comicRoutes: Routes = [
  {
    path: 'tag',
    module: TagModule,
  },
  {
    path: 'thumb',
    module: ThumbModule,
  },
];
