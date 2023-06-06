import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { createHash } from 'crypto';
import * as fs from 'fs/promises';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { Temp } from 'src/entity/temp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TempService {
  constructor(
    @InjectRepository(Temp) private readonly temp: Repository<Temp>,
  ) {}

  async getTempFileList(): Promise<Temp[]> {
    return await this.temp.find();
  }

  async getIdListBySHA256(sha256List: string[]): Promise<number[]> {
    const queryBuilder = this.temp
      .createQueryBuilder('temp')
      .select('temp.id, temp.sha256')
      .where('temp.sha256 IN (:...sha256List)', { sha256List });
    const results = await queryBuilder.getRawMany();
    const idArray = sha256List.map((sha256) => {
      const result = results.find((item) => item.sha256 === sha256);
      return result ? result.id : null;
    });
    return idArray;
  }

  async uploadTempFile(file: Express.Multer.File): Promise<Temp> {
    const { buffer, originalname } = file;
    const fileExt = originalname.split('.').pop();
    const sha256 = createHash('sha256').update(buffer).digest('hex');
    let result = await this.temp.findOneBy({ sha256 });
    if (!result) {
      const id = nanoid();
      await fs.mkdir(path.join('temp', 'file'), { recursive: true });
      await fs.writeFile(path.join('temp', 'file', id), file.buffer);
      result = await this.temp.save(
        plainToClass(Temp, {
          id,
          fileExt,
          sha256,
        }),
      );
    }
    return result;
  }

  async clearTempFile(): Promise<object> {
    await deleteFolderRecursive(path.join('temp'));
    await this.temp.clear();
    return {};
  }
}

async function deleteFolderRecursive(
  folderPath: string,
  options?: {
    self?: boolean;
  },
): Promise<void> {
  const entries = await fs.readdir(folderPath);
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entryPath = path.join(folderPath, entry);
    const stat = await fs.stat(entryPath);
    if (stat.isDirectory()) {
      await deleteFolderRecursive(entryPath, { self: true });
    } else {
      await fs.unlink(entryPath);
    }
  }
  if (options?.self) await fs.rmdir(folderPath);
}
