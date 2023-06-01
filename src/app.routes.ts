import { Routes } from '@nestjs/core';
import { manageRoutes } from './manage/manage.routes';
import { ManageModule } from './manage/manage.module';

export const appRoutes: Routes = [
  {
    path: 'api',
    children: [
      {
        path: 'manage',
        module: ManageModule,
        children: manageRoutes,
      },
    ],
  },
];
