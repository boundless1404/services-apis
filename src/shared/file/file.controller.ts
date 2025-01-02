import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileMimeType } from '@/src/lib/enums';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
    @Body('metadata') metadata?: string,
  ) {
    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
    return this.fileService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype as FileMimeType,
      file.size,
      entityType,
      entityId,
      parsedMetadata,
    );
  }

  @Post('initiate-multipart')
  async initiateMultipartUpload(
    @Body('filename') filename: string,
    @Body('mimetype') mimetype: FileMimeType,
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
  ) {
    return this.fileService.initiateMultipartUpload(
      filename,
      mimetype,
      entityType,
      entityId,
    );
  }

  @Post('complete-multipart')
  async completeMultipartUpload(
    @Body('key') key: string,
    @Body('uploadId') uploadId: string,
    @Body('parts') parts: { ETag: string; PartNumber: number }[],
    @Body('size') size: number,
    @Body('metadata') metadata?: string,
  ) {
    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;
    return this.fileService.completeMultipartUpload(
      key,
      uploadId,
      parts,
      size,
      parsedMetadata,
    );
  }

  @Get(':id/url')
  async getPermanentUrl(@Param('id') id: string) {
    const file = await this.fileService.getFileById(id);
    if (!file) {
      return null;
    }
    return this.fileService.getPermanentUrl(file.key);
  }
}
