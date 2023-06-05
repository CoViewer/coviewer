import { ReadStream } from 'fs';
import { Readable } from 'stream';

export interface IStorageDriverService {
  /**
   * 上传文件
   * @param file 二进制数据
   * @param path 欲保存路径
   */
  upload(file: Buffer | string, path: string): Promise<string | null>;

  /**
   * 批量上传文件
   * @param files
   * @param path 保存父目录
   */
  uploadMany(
    files: { name: string; file: Buffer | string }[],
    path: string,
  ): Promise<string[] | null>;
  // TODO: 这儿返回啥啊啊啊啊

  /**
   * 获取文件二进制缓冲区数据
   * @param filePath 文件路径
   */
  bufferDownload(filePath: string): Promise<Buffer | null>;

  /**
   * 获取文件二进制可读流数据
   * @param filePath 文件路径
   */
  streamDownload(
    filePath: string,
  ): Promise<ReadableStream | ReadStream | Readable | null>;

  /**
   * 获取目录
   * @param dir 路径
   */
  readDir(dir: string): Promise<string[]>;

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
