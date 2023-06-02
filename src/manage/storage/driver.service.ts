import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3ClientConfig,
  HeadBucketCommand,
  HeadBucketCommandOutput,
} from '@aws-sdk/client-s3';
import { S3Addition } from './storage.dto';

export interface IStorageDriverService {
  upload(file: Buffer, path: string): Promise<string | null>;
  download(filePath: string): Promise<Buffer | null>;
  delete(filePath: string): Promise<boolean>;
  exists(filePath: string): Promise<boolean>;
  getUrl(filePath: string): Promise<string>;
}

@Injectable()
export class S3StorageDriverService implements IStorageDriverService {
  private s3Client: S3Client;
  private additionConfig: S3Addition;

  constructor(connectionConfig: S3ClientConfig, additionConfig: S3Addition) {
    this.s3Client = new S3Client(connectionConfig);
    this.additionConfig = additionConfig;
  }

  async headBucket(): Promise<HeadBucketCommandOutput> {
    // let result: HeadBucketCommandOutput;
    // try {
    //   result = await this.s3Client.send(
    //     new HeadBucketCommand({ Bucket: this.additionConfig.bucket }),
    //   );
    // } catch (error) {
    //   result = error;
    // }
    // return result;
    return await this.s3Client.send(
      new HeadBucketCommand({ Bucket: this.additionConfig.bucket }),
    );
  }

  async demo(): Promise<ListObjectsCommandOutput> {
    const result = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.additionConfig.bucket,
      }),
    );

    return result;
  }

  async upload(file: Buffer, path: string): Promise<string | null> {
    try {
      const results = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.additionConfig.bucket,
          Key: 'test',
          Body: 'testtest',
        }),
      );
      return results ? results.ETag : null;
    } catch (err) {
      console.log('Error', err);
    }
  }

  download(filePath: string): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
  delete(filePath: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  exists(filePath: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getUrl(filePath: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

// @Injectable()
// export class LocalStorageDriverService implements IStorageDriverService {}

// @Injectable()
// export class WebDavStorageDriverService implements IStorageDriverService {}

// @Injectable()
// export class AlistStorageDriverService implements IStorageDriverService {}
