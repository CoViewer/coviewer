import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import {
  StorageDetailDto,
  StorageDto,
  StorageQuery,
  StorageUpdateDto,
} from './storage.dto';
import { Storage } from 'src/entity/storage.entity';

@Controller()
export class StorageController {
  constructor(private storageSerivce: StorageService) {}

  @Get('list')
  getStorageList(): Promise<StorageDetailDto[]> {
    return this.storageSerivce.getStorageList();
  }

  @Get('detail')
  getStorageDetail(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<StorageDetailDto> {
    return this.storageSerivce.getStorageDetail(id);
  }

  @Get('dir')
  getStorageDir(
    @Query('id', ParseIntPipe) id: number,
    @Query('dir') dir: string,
  ) {
    return this.storageSerivce.getStorageDir(id, dir);
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

  @Put('update')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  updateStorage(@Body() data: StorageUpdateDto): object {
    const storageData: Storage = {
      ...data,
      connection: JSON.stringify(data.connection),
      addition: JSON.stringify(data.addition),
    };
    return this.storageSerivce.updateStorage(storageData);
  }

  @Delete('delete')
  deleteStorage(@Body() data: StorageQuery): object {
    const { id } = data;
    return this.storageSerivce.deleteStorage(id);
  }
}
