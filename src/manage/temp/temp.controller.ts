import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Temp } from 'src/entity/temp.entity';
import { TempService } from './temp.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class TempController {
  constructor(private tempService: TempService) {}

  @Get('list')
  async getTempFileList(): Promise<Temp[]> {
    return await this.tempService.getTempFileList();
  }

  @Post('getIdListBySHA256')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getIdListBySHA256(@Body() sha256List: string[]): Promise<number[]> {
    return await this.tempService.getIdListBySHA256(sha256List);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Temp> {
    return await this.tempService.uploadTempFile(file);
  }

  @Delete('clear')
  async clearTempFile(): Promise<object> {
    return await this.tempService.clearTempFile();
  }
}
