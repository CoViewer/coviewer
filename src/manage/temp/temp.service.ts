import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Temp } from 'src/entity/temp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TempService {
  constructor(
    @InjectRepository(Temp) private readonly temp: Repository<Temp>,
  ) {}

  async getTempList(): Promise<Temp[]> {
    return await this.temp.find();
  }

  async getIdListBySHA256(sha256List: string[]): Promise<number[]> {
    const queryBuilder = this.temp
      .createQueryBuilder('temp')
      .select('temp.id', 'id')
      .where('temp.sha256 IN (:...sha256List)', { sha256List });
    const results = await queryBuilder.getRawMany();
    const idArray = sha256List.map((sha256) => {
      const result = results.find((item) => item.sha256 === sha256);
      return result ? result.id : null;
    });
    return idArray;
  }
}
