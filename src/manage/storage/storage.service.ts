import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LocalStorageDriverService,
  OSSStroageDriverService,
  S3StorageDriverService,
  WebDAVStorageDriverService,
} from './driver/driver.service';
import { Storage } from 'src/entity/storage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageDetailDto } from './storage.dto';
import { Comic } from 'src/entity/comic.entity';
import { IStorageDriverService } from './driver/driver.interface';

@Injectable()
export class StorageDriverFactory {
  createStorage(storage: Storage): IStorageDriverService {
    switch (storage.driver) {
      case 's3':
        return new S3StorageDriverService(
          JSON.parse(storage.connection),
          JSON.parse(storage.addition),
        );
      case 'oss':
        return new OSSStroageDriverService(
          JSON.parse(storage.connection),
          JSON.parse(storage.addition),
        );
      case 'webdav':
        return new WebDAVStorageDriverService(JSON.parse(storage.connection));
      case 'local':
        return new LocalStorageDriverService();
      default:
        throw new BadRequestException(
          'Invalid storage driver: ' + storage.driver,
        );
    }
  }
}

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
    @InjectRepository(Comic) private readonly comic: Repository<Comic>,
    private readonly storageDriverFactory: StorageDriverFactory,
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
      case 'oss':
        const oss = new OSSStroageDriverService(
          JSON.parse(storage.connection),
          JSON.parse(storage.addition),
        );
        const a = await oss.head();
        console.log(a);
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

  async getStorageDetail(id: number): Promise<StorageDetailDto> {
    const storage = await this.storage.findOneBy({ id });

    if (!storage) {
      throw new NotFoundException('Storage not found');
    }

    const comicCount = await this.comic.countBy({ storage: id });
    return {
      ...storage,
      connection: JSON.parse(storage.connection),
      addition: JSON.parse(storage.addition),
      comicCount,
    };
  }

  async getStorageDir(id: number, dir: string): Promise<string[]> {
    const storageConfig = await this.storage.findOneBy({ id });
    const storage = this.storageDriverFactory.createStorage(storageConfig);
    // console.log(storage);
    // console.log(storageConfig);
    return await storage.readDir(dir);
  }

  async updateStorage(data: Storage): Promise<object> {
    await this.validStorage(data);
    const result = await this.storage.update(data.id, data);
    if (result.affected == 0) throw new NotFoundException('Storage not found');
    return {};
  }

  async deleteStorage(id: number): Promise<object> {
    const result = await this.storage.delete(id);
    if (result.affected == 0) throw new NotFoundException('Storage not found');
    return {};
  }
}
