import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageDto } from './storage.dto';
import { Storage } from 'src/entity/storage.entity';

@Controller()
export class StorageController {
  constructor(private storageSerivce: StorageService) {}

  @Get('demo')
  getInfo(): object {
    return this.storageSerivce.getInfo();
  }

  @Post('add')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  addStorage(@Body() data: StorageDto): object {
    const storageData: Storage = {
      ...data,
      addition: JSON.stringify(data.addition),
    };
    return this.storageSerivce.addStorage(storageData);
  }
}
