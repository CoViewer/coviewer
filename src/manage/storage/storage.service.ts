import { Injectable } from '@nestjs/common';
import { S3StorageDriverService } from './driver.service';
import { Storage } from 'src/entity/storage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
  ) {}

  async getInfo(): Promise<object> {
    let s3 = new S3StorageDriverService({ bucket: 'coviewer' });

    let result = await s3.demo();

    return result;
  }

  async addStorage(data: Storage): Promise<object> {
    return await this.storage.save(data);
  }
}
