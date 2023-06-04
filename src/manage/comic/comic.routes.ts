import { Routes } from '@nestjs/core';
import { TagModule } from './tag/tag.module';

export const comicRoutes: Routes = [
  {
    path: 'tag',
    module: TagModule,
  },
];
