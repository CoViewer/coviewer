import { ReadStream } from "fs";
import { Readable } from "stream";

export interface IStorageDriverService {
  /**
   * 上传文件
   * @param file 二进制数据
   * @param path 欲保存路径
   */
  upload(file: Buffer, path: string): Promise<string | null>;

  /**
   * 获取文件二进制缓冲区数据
   * @param filePath 文件路径
   */
  bufferDownload(filePath: string): Promise<Buffer | null>;

  /**
   * 获取文件二进制可读流数据
   * @param filePath 文件路径
   */
  streamDownload(filePath: string): Promise<ReadableStream | ReadStream | Readable | null>;

  /**
   * 删除文件
   * @param filePath 文件路径
   */
  delete(filePath: string): Promise<boolean>;

  /**
   * 文件是否存在
   * @param filePath 文件路径
   */
  exists(filePath: string): Promise<boolean>;

  /**
   * 获取文件访问 Url
   * @param filePath 文件路径
   */
  getUrl(filePath: string): Promise<string | null>;
}
