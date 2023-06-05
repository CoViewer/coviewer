import { BadRequestException } from '@nestjs/common';
import {
  IsNotEmpty,
  IsIn,
  IsString,
  ValidateNested,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  validateSync,
  IsDefined,
  IsUrl,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

function IsConfigValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isConfigValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { driver } = args.object as StorageDto;
          switch (propertyName) {
            case 'connection':
              switch (driver) {
                case 's3':
                  if (!value || validateSync(new S3Config(value)).length != 0) {
                    throw new BadRequestException('Invalid S3 configuration');
                  }
                  break;
                case 'oss':
                  if (
                    !value ||
                    validateSync(new OSSConfig(value)).length != 0
                  ) {
                    throw new BadRequestException('Invalid OSS configuration');
                  }
                  break;
                case 'webdav':
                  if (
                    !value ||
                    validateSync(new WebDAVConfig(value)).length != 0
                  ) {
                    throw new BadRequestException(
                      'Invalid WebDAV configuration',
                    );
                  }
                  break;

                case 'local':
                  break;
                default:
                  throw new BadRequestException('Invalid driver:' + driver);
              }
              break;
            case 'addition':
              switch (driver) {
                case 's3':
                  if (
                    !value ||
                    validateSync(new S3Addition(value)).length != 0
                  ) {
                    throw new BadRequestException('Invalid S3 addition');
                  }
                  break;
                case 'oss':
                  if (
                    !value ||
                    validateSync(new OSSAddition(value)).length != 0
                  ) {
                    throw new BadRequestException('Invalid OSS addition');
                  }
                  break;
                case 'webdav':
                case 'local':
                  break;
                default:
                  throw new BadRequestException('Invalid driver:' + driver);
              }

            default:
              break;
          }
          return true;
        },
      },
    });
  };
}

export class S3ConfigCredentials {
  @IsNotEmpty()
  @IsString()
  accessKeyId: string;

  @IsNotEmpty()
  @IsString()
  secretAccessKey: string;

  constructor(data: S3ConfigCredentials) {
    this.accessKeyId = data.accessKeyId;
    this.secretAccessKey = data.secretAccessKey;
  }
}

export class S3Config {
  @IsDefined()
  @ValidateNested()
  credentials: S3ConfigCredentials;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsUrl()
  endpoint: string;

  constructor(data: S3Config) {
    if (data.credentials)
      this.credentials = new S3ConfigCredentials(data.credentials);
    this.region = data.region;
    this.endpoint = data.endpoint;
  }
}

export class WebDAVConfig {
  @IsNotEmpty()
  @IsUrl()
  address: string;

  @IsString()
  username?: string;

  @IsString()
  password?: string;

  constructor(data: WebDAVConfig) {
    this.address = data.address;
    this.username = data.username;
    this.password = data.password;
  }
}

export class S3Addition {
  @IsNotEmpty()
  @IsString()
  bucket: string;

  @IsBoolean()
  signed?: boolean;

  constructor(data: S3Addition) {
    this.bucket = data.bucket;
    this.signed = data.signed;
  }
}

export class OSSConfig {
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsBoolean()
  @IsOptional()
  internal?: boolean;

  @IsBoolean()
  @IsOptional()
  secure?: boolean;

  @IsString()
  @IsOptional()
  cname?: string;

  @IsString()
  bucket: string;

  @IsUrl()
  @IsOptional()
  endpoint?: string;

  @IsNotEmpty()
  @IsString()
  accessKeyId: string;

  @IsNotEmpty()
  @IsString()
  accessKeySecret: string;

  constructor(data: OSSConfig) {
    this.region = data.region;
    this.internal = data.internal;
    this.secure = data.secure;
    this.cname = data.cname;
    this.bucket = data.bucket;
    this.endpoint = data.endpoint;
    this.accessKeyId = data.accessKeyId;
    this.accessKeySecret = data.accessKeySecret;
  }
}

export class OSSAddition {
  @IsBoolean()
  @IsOptional()
  signed?: boolean;
  constructor(data: OSSAddition) {
    this.signed = data.signed;
  }
}

export class StorageDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['s3', 'oss', 'local', 'webdav'])
  driver: StorageDriver;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsConfigValid()
  @ValidateNested()
  connection?: StorageConnectionConfig;

  @IsConfigValid()
  @ValidateNested()
  addition?: StorageAdditionConfig;
}

export class StorageUpdateDto extends StorageDto {
  @IsNumber()
  id: number;
}

export class StorageDetailDto extends StorageDto {
  comicCount: number;
}

export class StorageQuery {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export type StorageDriver = 's3' | 'oss' | 'local' | 'webdav';
type StorageConnectionConfig = S3Config | OSSConfig | WebDAVConfig;
type StorageAdditionConfig = S3Addition | OSSAddition;
