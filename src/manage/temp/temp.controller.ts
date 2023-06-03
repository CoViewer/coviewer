import { Controller, Get, Post, Delete, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Temp } from 'src/entity/temp.entity';
import { TempService } from './temp.service';

@Controller()
export class TempController {
  constructor(private tempService: TempService) {}

  @Get('list')
  async getTempList(): Promise<Temp[]> {
    return await this.tempService.getTempList();
  }

  @Post('getIdListBySHA256')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getIdListBySHA256(
    @Body() sha256List: string[],
  ): Promise<number[]> {
    return await this.tempService.getIdListBySHA256(sha256List);
  }
}
