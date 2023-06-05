import { Injectable } from '@nestjs/common';
import { OSSAddition } from 'src/manage/storage/storage.dto';
import { IStorageDriverService } from './driver.interface';
import OSS = require('ali-oss');

@Injectable()
export class OSSStroageDriverService implements IStorageDriverService {
  private ossClient: OSS;
  private additionConfig: OSSAddition;

  constructor(connectionConfig: OSS.Options, additionConfig: OSSAddition) {
    this.ossClient = new OSS(connectionConfig);
    this.additionConfig = additionConfig;
  }
  async head(): Promise<object> {
    return await this.ossClient.head('/');
  }
  // TODO: 111
  async upload(file: Buffer, path: string): Promise<string> {
    const result = await this.ossClient.put(path, file);
    console.log(result);
    return 'result';
  }
  async bufferDownload(filePath: string): Promise<Buffer> {
    const result = await this.ossClient.get(filePath);
    return result.content;
  }
  async streamDownload(filePath: string): Promise<ReadableStream<any>> {
    const result = await this.ossClient.getStream(filePath);
    return result.stream;
  }
  async readDir(dir: string): Promise<string[]> {
    // 只要不是根目录，判断是否为文件夹格式结尾
    if (!dir.endsWith('/') && dir != '') dir += '/';
    const result = await this.ossClient.listV2(
      {
        prefix: dir,
        delimiter: '/',
      },
      {},
    );
    if (result.prefixes)
      return result.prefixes.map((e) => e.split('/').splice(-2)[0]);
    else return null;
  }
  async delete(filePath: string): Promise<boolean> {
    const result = await this.ossClient.delete(filePath);
    return result ? true : false;
  }
  async exists(filePath: string): Promise<boolean> {
    try {
      await this.ossClient.head(filePath);
      return true;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        return false;
      } else {
        throw error;
      }
    }
  }
  async getUrl(filePath: string): Promise<string> {
    if (this.additionConfig.signed) {
      return this.ossClient.signatureUrl(filePath);
    } else {
      return this.ossClient.getObjectUrl(filePath);
    }
  }
}
