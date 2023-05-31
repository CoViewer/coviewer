import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as config from '../data/config.json';
import { Comic } from './entities/comic.entity';
import { ComicTag } from './entities/comic-tag.entity';
import { Image } from './entities/image.entity';
import { Temp } from './entities/temp.entity';
import { Storage } from './entities/storage.entity';
import { Meta } from './entities/meta.entity';
import { History } from './entities/history.entity';
import { User } from './entities/user.entity';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: config.database.db_file || 'data/data.db',
      entities: [
        Setting,
        Comic,
        ComicTag,
        Image,
        Temp,
        Storage,
        Meta,
        History,
        User,
      ],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
