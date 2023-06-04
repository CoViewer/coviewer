import { BadRequestException } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  IsDefined,
  IsNumber,
} from 'class-validator';

function IsValueValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValueValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (!value) throw new BadRequestException('value is invalid');
          const tagArr = value.split(':');
          if (tagArr.length != 2)
            throw new BadRequestException(
              "Tag value format should be 'cate:value'",
            );
          return true;
        },
      },
    });
  };
}

export class ComicTagDto {
  id: number;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @IsValueValid()
  value: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;
}

export class ComicTagQuery {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
