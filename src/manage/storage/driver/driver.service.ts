import { Injectable } from '@nestjs/common';
import { S3StorageDriverService } from './s3.service';
import { WebDAVStorageDriverService } from './webdav.service';
import { LocalStorageDriverService } from './local.service';
import { OSSStroageDriverService } from './oss.service';

@Injectable()
export class DriverService {}
export {
  S3StorageDriverService,
  WebDAVStorageDriverService,
  LocalStorageDriverService,
  OSSStroageDriverService,
};
