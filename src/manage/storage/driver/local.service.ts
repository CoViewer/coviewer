import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { IStorageDriverService } from './driver.interface';
import { ReadStream } from 'fs';
import { resolve } from 'path';

@Injectable()
export class LocalStorageDriverService implements IStorageDriverService {
  async upload(file: Buffer | string, path: string): Promise<null> {
    try {
      if (typeof file == 'string') {
        fs.copyFileSync(file, resolve(path));
      } else {
        fs.writeFileSync(resolve(path), file);
      }
      return null;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  }

  async uploadMany(
    files: { name: string; file: Buffer | string }[],
    path: string,
  ): Promise<null> {
    for (let i = 0; i < files.length; i++) {
      const { file, name } = files[i];
      await this.upload(file, resolve(path, name));
    }
    return null;
  }

  async bufferDownload(filePath: string): Promise<Buffer> {
    try {
      const fileData = fs.readFileSync(filePath);
      return fileData;
    } catch (error) {
      throw new Error('Failed to read file');
    }
  }

  // TODO: 感觉会有问题
  async streamDownload(filePath: string): Promise<ReadStream> {
    return fs.createReadStream(filePath);
  }

  async readDir(dir: string): Promise<string[]> {
    return fs.readdirSync(dir);
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      throw new Error('Failed to delete file');
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      fs.accessSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  // TODO: 未实现
  async getUrl(filePath: string): Promise<string> {
    return filePath;
  }
}
