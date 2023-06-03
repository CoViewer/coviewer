import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  S3StorageDriverService,
  WebDAVStorageDriverService,
} from './driver/driver.service';
import { Storage } from 'src/entity/storage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { StorageDetailDto, StorageDto } from './storage.dto';
import { Comic } from 'src/entity/comic.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
    @InjectRepository(Comic) private readonly comic: Repository<Comic>,
  ) {}

  async validStorage(storage: Storage): Promise<boolean> {
    // 校验连接
    switch (storage.driver) {
      case 's3':
        const s3 = new S3StorageDriverService(
          JSON.parse(storage.connection),
          JSON.parse(storage.addition),
        );
        await s3.headBucket();
        break;
      case 'webdav':
        const webdav = new WebDAVStorageDriverService(
          JSON.parse(storage.connection),
        );
        await webdav.valid();
        break;
      case 'local':
        if (await this.storage.countBy({ driver: 'local' }))
          throw new HttpException('The local storage already exists', 409);
        break;
      default:
        break;
    }
    return true;
  }

  async addStorage(storage: Storage): Promise<object> {
    await this.validStorage(storage);
    return await this.storage.save(storage);
  }

  async getStorageList(): Promise<StorageDetailDto[]> {
    // 单次查询方法
    // code with ChatGPT
    const storageList = await this.storage.find();
    const storageIds = storageList.map((storage) => storage.id);

    const queryBuilder = this.comic
      .createQueryBuilder('comic')
      .select('comic.storage', 'storageId')
      .addSelect('COUNT(comic.id)', 'comicCount')
      .groupBy('comic.storage')
      .andWhere('comic.storage IN (:...storageIds)', { storageIds });

    const comicCounts = await queryBuilder.getRawMany();
    const storageMap = new Map<number, StorageDetailDto>();

    storageList.forEach((storage) => {
      return storageMap.set(storage.id, {
        ...storage,
        connection: JSON.parse(storage.connection),
        addition: JSON.parse(storage.addition),
        comicCount: 0,
      });
    });

    comicCounts.forEach((result) => {
      const storageId = result.storageId;
      const comicCount = parseInt(result.comicCount, 10);
      if (storageMap.has(storageId)) {
        const storage = storageMap.get(storageId);
        storage.comicCount = comicCount;
      }
    });

    return Array.from(storageMap.values()) as StorageDetailDto[];
  }

  async getStorageDetail(storageId: number): Promise<StorageDetailDto> {
    const storage = await this.storage.findOneBy({ id: storageId });

    if (!storage) {
      throw new NotFoundException('Storage not found');
    }

    const comicCount = await this.comic.countBy({ storage: storageId });
    return {
      ...storage,
      connection: JSON.parse(storage.connection),
      addition: JSON.parse(storage.addition),
      comicCount,
    };
  }

  async updateStorage(storage: Storage): Promise<object> {
    await this.validStorage(storage);
    const result = await this.storage.update(storage.id, storage);
    if (result.affected == 0) throw new HttpException('Storage not found', 404);
    return {};
  }

  async deleteStorage(storageId: number): Promise<object> {
    const result = await this.storage.delete({ id: storageId });
    if (result.affected == 0) throw new HttpException('Storage not found', 404);
    return {};
  }
}
