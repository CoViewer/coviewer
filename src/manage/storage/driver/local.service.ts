import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { IStorageDriverService } from './driver.interface';
import { ReadStream } from 'fs';

@Injectable()
export class LocalStorageDriverService implements IStorageDriverService {

  async upload(file: Buffer, path: string): Promise<string> {
    try {
      fs.writeFileSync(path, file);
      return path;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
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
    return fs.createReadStream(filePath)
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
