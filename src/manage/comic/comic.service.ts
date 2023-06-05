import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Comic } from 'src/entity/comic.entity';
import { In, Repository } from 'typeorm';
import { StorageDriverFactory } from '../storage/storage.service';
import { Storage } from 'src/entity/storage.entity';
import { Temp } from 'src/entity/temp.entity';
import { getNextNameFromNumberString } from 'src/util';
import * as path from 'path';
import { Image } from 'src/entity/image.entity';

@Injectable()
export class ComicService {
  constructor(
    @InjectRepository(Comic) private readonly comic: Repository<Comic>,
    @InjectRepository(Storage) private readonly storage: Repository<Storage>,
    @InjectRepository(Image) private readonly image: Repository<Image>,
    @InjectRepository(Temp) private readonly temp: Repository<Temp>,
  ) {}

  async getComicList(pageSize: number, offset: number): Promise<Comic[]> {
    return await this.comic
      .createQueryBuilder('comic')
      .orderBy('comic.uploadTime', 'DESC')
      .skip(offset)
      .take(pageSize)
      .getMany();
  }

  async getComicDetail(id: number): Promise<Comic> {
    const result = await this.comic.findOneBy({ id });
    if (!result) throw new NotFoundException("Comic not found");
    return result;
  }

  async addComic(data: Comic): Promise<Comic> {
    // 首先将 image 列表中所有临时文件 从 Temp 移至 Image
    // 准确来说是上传
    // 根据预先定好的 storage 和 path

    // 检查 image list 是否有重复
    const duplicates = data.image.reduce((acc, item, index) => {
      if (data.image.indexOf(item, index + 1) !== -1 && !acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
    if (duplicates.length != 0)
      throw new BadRequestException(
        'There are duplicate images: ' + duplicates.join(', '),
      );

    // 检查 title 冲突
    if (await this.comic.findOneBy({ title: data.title }))
      throw new BadRequestException('Comic already exists');

    // 实例化存储器
    const storageFactory = new StorageDriverFactory();
    const storageOptions = await this.storage.findOneBy({ id: data.storage });
    const storage = storageFactory.createStorage(storageOptions);

    // 获取存储的临时文件
    const tempFiles = await this.temp.findBy({ id: In(data.image) });
    if (tempFiles.length != data.image.length)
      throw new NotFoundException(
        'There are temp files cannot found: ' +
          data.image
            .map((e) => e.id)
            .filter((e) => !tempFiles.map((f) => f.id).includes(e)),
      );

    // 获取已经存储的图片 防止重复
    const existsImages = await this.image.findBy({ id: In(data.image) });
    if (existsImages.length != 0)
      throw new BadRequestException(
        'There are already exists images: ' +
          existsImages.map((e) => e.id).join(', '),
      );

    // 生成文件名
    const startNumber = '000001';
    const fileNames = getNextNameFromNumberString(
      startNumber,
      tempFiles.length,
    ) as string[];
    const files = fileNames.map((e, i) => {
      const file = path.join('temp', 'file', tempFiles[i].id);
      return {
        file,
        name: e + '.' + tempFiles[i].fileExt,
      };
    });

    // 上传
    await storage.uploadMany(files, data.path);

    // 存入 image
    const images = tempFiles.map((e, i) => {
      const { id, sha256 } = e;
      const { name } = files[i];
      return plainToClass(Image, {
        id,
        fileName: name,
        sha256,
      });
    });
    await this.image.save(images);

    const comic = await this.comic.save(plainToClass(Comic, data));

    await this.image
      .createQueryBuilder()
      .update(Image)
      .set({ comic: comic.id })
      .whereInIds(images.map((e) => e.id))
      .execute();

    return comic;
  }

  async deleteComic(id: number): Promise<object> {
    const result = await this.comic.delete(id);
    if (result.affected == 0) throw new NotFoundException('Comic not found');
    return {};
  }
}
