import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { File } from '../../entities/file.entity';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { FileMimeType } from '@/src/lib/enums';

@Injectable()
export class FileService {
  constructor(
    // @InjectRepository(File)
    // private fileRepository: Repository<File>,
    private datasource: DataSource,
    private awsS3Service: AwsS3Service,
  ) {
    //
    this.dbManager = this.datasource.createEntityManager();
  }

  dbManager: EntityManager;

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: FileMimeType,
    size: number,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>,
  ): Promise<File> {
    const key = `${entityType}/${entityId}/${Date.now()}-${filename}`;
    const url = await this.awsS3Service.uploadFile(fileBuffer, key, mimetype);

    const newFile = this.dbManager.create(File, {
      filename,
      mimetype,
      size,
      url,
      key,
      metadata,
    });

    return this.dbManager.save(newFile);
  }

  async initiateMultipartUpload(
    filename: string,
    mimetype: FileMimeType,
    entityType: string,
    entityId: string,
  ): Promise<{ uploadId: string; key: string }> {
    const key = `${entityType}/${entityId}/${Date.now()}-${filename}`;
    const uploadId = await this.awsS3Service.initiateMultipartUpload(
      key,
      mimetype,
    );
    return { uploadId, key };
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
    size: number,
    metadata?: Record<string, any>,
  ): Promise<File> {
    const url = await this.awsS3Service.completeMultipartUpload(
      key,
      uploadId,
      parts,
    );

    const newFile = this.dbManager.create(File, {
      filename: key.split('/').pop(),
      mimetype: FileMimeType.UNKNOWN,
      size,
      url,
      key,
      metadata,
    });

    return this.dbManager.save(newFile);
  }

  async getFileById(id: string): Promise<File> {
    return this.dbManager.findOne(File, { where: { id } });
  }

  getPermanentUrl(key: string): string {
    return this.awsS3Service.getPermanentUrl(key);
  }
}
