import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内置配置文件
import * as config from '../data/config.json';

// ORM 实体
import { Comic } from './entity/comic.entity';
import { ComicTag } from './entity/comic-tag.entity';
import { ComicTagRule } from './entity/comic-tag-rule.entity';
import { Image } from './entity/image.entity';
import { Temp } from './entity/temp.entity';
import { Storage } from './entity/storage.entity';
import { Meta } from './entity/meta.entity';
import { History } from './entity/history.entity';
import { User } from './entity/user.entity';
import { Setting } from './entity/setting.entity';

import { Thumb } from './entity/thumb.entity';

// 控制器
import { ManageModule } from './manage/manage.module';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { appRoutes } from './app.routes';
import { CustomExceptionFilter } from './custom-exception.filter';
import { TransformResponseInterceptor } from './transform-response.interceptor';
import { ValidationPipe } from './validate.pipe';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: config.data.database.db_file || 'data/data.db',
      entities: [
        Setting,
        Comic,
        ComicTag,
        ComicTagRule,
        Image,
        Temp,
        Storage,
        Meta,
        History,
        User,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'thumb',
      type: 'sqlite',
      database: config.thumb.database.db_file || 'data/thumb.db',
      entities: [Thumb],
      synchronize: true,
    }),
    ManageModule,
    RouterModule.register(appRoutes),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
