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
import { StorageDetailDto, StorageDto } from './storage.dto';
import { Storage } from 'src/entity/storage.entity';

@Controller()
export class StorageController {
  constructor(private storageSerivce: StorageService) {}

  @Get('demo')
  getInfo(): object {
    return this.storageSerivce.getInfo();
  }

  @Get('list')
  getStorageList(): Promise<StorageDetailDto[]> {
    return this.storageSerivce.getStorageList();
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
      connection: JSON.stringify(data.connection),
      addition: JSON.stringify(data.addition),
    };
    return this.storageSerivce.addStorage(storageData);
  }
}
