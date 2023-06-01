import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException, Error)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { message } = exception;

    // 默认 ISS 500
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = message;
    let data = {};

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus() || statusCode;

      // 请求体校验失败
      if (statusCode == 400) data = exception.getResponse();
      
    } else if (exception instanceof Error) {

      // 项目冲突
      if (message.includes('UNIQUE constraint failed')) {
        msg = 'Item conflict';
        statusCode = HttpStatus.CONFLICT;
      }
    }

    console.log(exception);

    response.status(statusCode).json({
      code: statusCode,
      msg,
      data,
    });
  }
}
