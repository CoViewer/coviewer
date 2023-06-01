import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client, ListObjectsCommand, ListObjectsCommandOutput} from '@aws-sdk/client-s3';

export interface IStorageDriverService {
  upload(file: Buffer, path: string): Promise<string | null>;
  download(filePath: string): Promise<Buffer | null>;
  delete(filePath: string): Promise<boolean>;
  exists(filePath: string): Promise<boolean>;
  getUrl(filePath: string): Promise<string>;
}

class BucketConfig {
  bucket: string;
}

@Injectable()
export class S3StorageDriverService implements IStorageDriverService {

  private s3Client: S3Client;
  private bucketConfig: BucketConfig;

  constructor(bucketConfig: BucketConfig) {}

  async demo(): Promise<ListObjectsCommandOutput> {

    const result = await this.s3Client.send(new ListObjectsCommand({
      Bucket: this.bucketConfig.bucket
    }))

    return result;

  }

  async upload(file: Buffer, path: string): Promise<string | null> {
    try {
      const results = await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketConfig.bucket,
        Key: "test",
        Body: "testtest"
      }));
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
