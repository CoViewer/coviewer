import { Module } from '@nestjs/common';
import { TempService } from './temp.service';
import { TempController } from './temp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temp } from 'src/entity/temp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Temp])],
  providers: [TempService],
  controllers: [TempController],
})
export class TempModule {}
