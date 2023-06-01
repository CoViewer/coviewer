import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { message } = exception;

    // 默认使用 500 状态码
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = null;

    // 项目冲突
    if (message.includes('UNIQUE constraint failed')) {
      msg = 'Item conflict';
      statusCode = HttpStatus.CONFLICT;
      
    } else {
      msg = message;
    }

    console.log(message);

    response.status(statusCode).json({
      code: statusCode,
      msg,
      data: {},
    });
  }
}
