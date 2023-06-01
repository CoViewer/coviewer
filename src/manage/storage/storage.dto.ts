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
          switch (driver) {
            case 's3':
              console.log(new S3Config(value));
              if (validateSync(new S3Config(value)).length != 0) {
                console.log(validateSync(new S3Config(value)));
                throw new BadRequestException('Invalid S3 configuration');
              }
              break;
            case 'local':
              if (validateSync(new LocalConfig(value)).length != 0) {
                throw new BadRequestException('Invalid Local configuration');
              }
              break;
            case 'webdav':
              if (validateSync(new WebDavConfig(value)).length != 0) {
                throw new BadRequestException('Invalid WebDAV configuration');
              }
              break;
            default:
              throw new BadRequestException('Invalid driver:' + driver);
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
  @ValidateNested()
  credentials: S3ConfigCredentials;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  endpoint: string;

  constructor(data: S3Config) {
    this.credentials = new S3ConfigCredentials(data.credentials);
    this.region = data.region;
    this.endpoint = data.endpoint;
  }
}

export class LocalConfig {
  constructor(data: LocalConfig) {}
}

export class WebDavConfig {
  constructor(data: WebDavConfig) {}
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
  addition: StorageAdditionConfig;
}

export type StorageDriver = 's3' | 'local' | 'webdav';
type StorageAdditionConfig = S3Config | LocalConfig | WebDavConfig;
