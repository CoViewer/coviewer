import { Controller, Get, Post, Put, Delete, Body, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { Storage } from 'src/entity/storage.entity';
import { TransformResponseInterceptor } from 'src/transform-response.interceptor';

@Controller()
export class StorageController {
  constructor(private storageSerivce: StorageService) {}

  @Get('demo')
  getInfo(): object {
    return this.storageSerivce.getInfo();
  }

  @Post('add')
  addStorage(@Body() data: Storage): object {
    return this.storageSerivce.addStorage(data);
  }
}
