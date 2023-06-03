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

export class StorageDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['s3', 'local', 'webdav'])
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

export type StorageDriver = 's3' | 'local' | 'webdav';
type StorageConnectionConfig = S3Config | WebDAVConfig;
type StorageAdditionConfig = S3Addition;
