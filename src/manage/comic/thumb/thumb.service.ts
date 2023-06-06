import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import * as sharp from 'sharp';
import { Comic } from 'src/entity/comic.entity';
import { Image } from 'src/entity/image.entity';
import { Thumb } from 'src/entity/thumb.entity';
import { StorageService } from 'src/manage/storage/storage.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class ThumbService {
  constructor(
    @InjectRepository(Comic) private readonly comic: Repository<Comic>,
    @InjectRepository(Image) private readonly image: Repository<Image>,
    @InjectRepository(Thumb, 'thumb') private readonly thumb: Repository<Thumb>,
    private readonly storageService: StorageService,
  ) {}

  async updateComicThumb(comicId: number): Promise<object> {
    // 获取漫画实体
    // 主要是获取存储信息
    const comic = await this.comic.findOne({
      where: {
        id: comicId,
      },
      relations: {
        storage: true,
        images: true,
        tags: true,
      },
    });
    if (!comic) throw new NotFoundException('Comic not found');

    const nonThumbImageIds = await this.getNonMatchingImageIds(
      comic.images.map((e) => e.id),
    );
    const nonThumbImages = comic.images.filter((e) =>
      nonThumbImageIds.includes(e.id),
    );

    if (nonThumbImages.length == 0) return {};

    // 存储器
    const storage = await this.storageService.createStorageById(
      comic.storage.id,
    );

    // 遍历需要生成缩略图的
    for (let i = 0; i < nonThumbImages.length; i++) {
      const image = nonThumbImages[i];
      const filePath = comic.path + image.fileName;
      const imageBuffer = await storage.bufferDownload(filePath);
      const thumbBuffer = await sharp(imageBuffer)
        .resize({ width: 100 })
        .toBuffer();
      await this.thumb.upsert(
        plainToClass(Thumb, {
          id: image.id,
          sha256: image.sha256,
          thumb: thumbBuffer,
        }),
        ['id'],
      );
    }

    return nonThumbImageIds;
  }

  //==

  async getNonMatchingImageIds(ids: string[]): Promise<string[]> {
    const images = await this.image
      .createQueryBuilder('image')
      .select(['image.id', 'image.sha256'])
      .whereInIds(ids)
      .getMany();

    const thumbSha256s = await this.thumb
      .createQueryBuilder('thumb')
      .select('thumb.sha256')
      .getMany();

    const thumbSha256Set = new Set(thumbSha256s.map((thumb) => thumb.sha256));

    const nonMatchingImageIds = images
      .filter((image) => !thumbSha256Set.has(image.sha256))
      .map((image) => image.id);

    return nonMatchingImageIds;
  }
}
