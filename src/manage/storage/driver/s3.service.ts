import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
  HeadBucketCommand,
  HeadBucketCommandOutput,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { S3Addition } from 'src/manage/storage/storage.dto';
import { IStorageDriverService } from './driver.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3StorageDriverService implements IStorageDriverService {
  private s3Client: S3Client;
  private additionConfig: S3Addition;

  constructor(connectionConfig: S3ClientConfig, additionConfig: S3Addition) {
    this.s3Client = new S3Client(connectionConfig);
    this.additionConfig = additionConfig;
  }

  async headBucket(): Promise<HeadBucketCommandOutput> {
    return await this.s3Client.send(
      new HeadBucketCommand({ Bucket: this.additionConfig.bucket }),
    );
  }

  async upload(file: Buffer, path: string): Promise<string | null> {
    const result = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.additionConfig.bucket,
        Key: path,
        Body: file,
      }),
    );
    console.log(result);
    return result ? result.ChecksumSHA1 : null;
  }

  async streamDownload(filePath: string): Promise<ReadableStream> {
    const result = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.additionConfig.bucket,
        Key: filePath,
      }),
    );
    return result.Body.transformToWebStream();
  }

  async bufferDownload(filePath: string): Promise<Buffer> {
    const result = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.additionConfig.bucket,
        Key: filePath,
      }),
    );
    return Buffer.from((await result.Body.transformToByteArray()).buffer);
  }

  async delete(filePath: string): Promise<boolean> {
    const result = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.additionConfig.bucket,
        Key: filePath,
      }),
    );
    return result.DeleteMarker;
  }
  async exists(filePath: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.additionConfig.bucket,
          Key: filePath,
        }),
      );
      return true;
    } catch (error) {
      if (error.name === 'NoSuchKey') return false;
    }
  }
  async getUrl(filePath: string): Promise<string> {
    // TODO: 分为开启签名和未开启签名两种
    return await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.additionConfig.bucket,
        Key: filePath,
      }),
    );
  }
}
