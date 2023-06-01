import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessages = this.flattenValidationErrors(errors);
      console.log(errorMessages);
      throw new BadRequestException(
        'Validation failed',
        errorMessages.join(' '),
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private flattenValidationErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    const traverse = (error: ValidationError, propertyPath: string) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          messages.push(`${propertyPath}: ${constraint}`);
        });
      }
      if (error.children && error.children.length > 0) {
        error.children.forEach((childError) => {
          traverse(childError, `${propertyPath}.${childError.property}`);
        });
      }
    };

    errors.forEach((error) => traverse(error, error.property));

    return messages;
  }
}
