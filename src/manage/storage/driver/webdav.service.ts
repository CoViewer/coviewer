import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as webdav from 'webdav';
import { IStorageDriverService } from './driver.interface';
import { WebDAVConfig } from '../storage.dto';
import { createReadStream } from 'fs';
import { resolve } from 'path';

@Injectable()
export class WebDAVStorageDriverService implements IStorageDriverService {
  private client: webdav.WebDAVClient;

  constructor(connectionConfig: WebDAVConfig) {
    this.client = webdav.createClient(connectionConfig.address, {
      username: connectionConfig.username,
      password: connectionConfig.password,
    });
  }

  async valid(): Promise<boolean> {
    return (await this.client.getQuota()) ? true : false;
  }

  async upload(file: Buffer | string, path: string): Promise<null> {
    const fileData = typeof file == 'string' ? createReadStream(file) : file;
    await this.client.putFileContents(path, fileData);
    return null;
  }

  async uploadMany(
    files: { name: string; file: string | Buffer }[],
    path: string,
  ): Promise<null> {
    for (let i = 0; i < files.length; i++) {
      const { file, name } = files[i];
      await this.upload(file, resolve(path, name));
    }
    return null;
  }

  async bufferDownload(filePath: string): Promise<Buffer> {
    return (await this.client.getFileContents(filePath, {
      format: 'binary',
    })) as Buffer;
  }

  async streamDownload(filePath: string): Promise<Readable> {
    return this.client.createReadStream(filePath);
  }

  async readDir(dir: string): Promise<string[]> {
    const contents = (await this.client.getDirectoryContents(
      dir,
    )) as webdav.FileStat[];
    const folders = contents
      .filter((object) => object.type == 'directory')
      .map((e) => e.basename);
    const files = contents
      .filter((object) => object.type == 'file')
      .map((e) => e.basename);
    return folders;
  }

  async delete(filePath: string): Promise<boolean> {
    await this.client.deleteFile(filePath);
    return true;
  }

  async exists(filePath: string): Promise<boolean> {
    return await this.client.exists(filePath);
  }

  async getUrl(filePath: string): Promise<string> {
    return this.client.getFileDownloadLink(filePath);
  }
}
