import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as webdav from 'webdav';
import { IStorageDriverService } from './driver.interface';
import { WebDAVConfig } from '../storage.dto';

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
    return await this.client.getQuota() ? true : false;
  }

  async bufferDownload(filePath: string): Promise<Buffer> {
    return (await this.client.getFileContents(filePath, {
      format: 'binary',
    })) as Buffer;
  }

  async streamDownload(filePath: string): Promise<Readable> {
    const readableStream = this.client.createReadStream(filePath);
    return readableStream;
  }

  async upload(file: Buffer, path: string): Promise<string> {
    await this.client.putFileContents(path, file);
    return path;
  }

  async delete(filePath: string): Promise<boolean> {
    await this.client.deleteFile(filePath);
    return true;
  }

  async exists(filePath: string): Promise<boolean> {
    const exists = await this.client.exists(filePath);
    return exists;
  }

  async getUrl(filePath: string): Promise<string> {
    const shareLink = await this.client.getFileDownloadLink(filePath);
    return shareLink;
  }
}
