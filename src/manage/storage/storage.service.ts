import { BadRequestException, Injectable } from '@nestjs/common';
import { S3StorageDriverService } from './driver.service';
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

  async getInfo(): Promise<object> {
    const id = 10;

    const storage = (await this.storage.findBy({ id }))[0];

    let s3 = new S3StorageDriverService(
      JSON.parse(storage.connection),
      JSON.parse(storage.addition),
    );

    let result = await s3.headBucket();

    return result;
  }

  async addStorage(storage: Storage): Promise<object> {
    // 校验连接
    switch (storage.driver) {
      case 's3':
        const s3 = new S3StorageDriverService(
          JSON.parse(storage.connection),
          JSON.parse(storage.addition),
        );
        await s3.headBucket();
        break;
      default:
        break;
    }

    // 存入数据库
    return await this.storage.save(storage);
  }

  async getStorageList(): Promise<StorageDetailDto[]> {

    // 多次查询方法
    // // 存储列表
    // const result = await this.storage.find().then(async (data) => {
    //   const promises = data.map(async (e) => {

    //     const comics = await this.comic.findAndCountBy({
    //       storage: e.id,
    //     });
    //     return {
    //       ...e,
    //       comicCount: comics[1] as number,
    //       connection: JSON.parse(e.connection) as object,
    //       addition: JSON.parse(e.addition) as object,
    //     };
    //   });
    //   return Promise.all(promises);
    // });

    // return result as StorageDetailDto[];

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

  async getStorageInfo() {}
}
