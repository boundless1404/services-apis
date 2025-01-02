import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { FileMimeType } from '@/src/lib/enums';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(
    file: Buffer,
    key: string,
    mimetype: string,
  ): Promise<string> {
    const params: PutObjectCommandInput = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: file,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);

    return this.getPermanentUrl(key);
  }

  async initiateMultipartUpload(
    key: string,
    contentType: FileMimeType,
  ): Promise<string> {
    const params: CreateMultipartUploadCommandInput = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    };

    const command = new CreateMultipartUploadCommand(params);
    const { UploadId } = await this.s3Client.send(command);
    return UploadId;
  }

  async uploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
    body: Buffer,
  ): Promise<{ ETag: string; PartNumber: number }> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: body,
    };

    const command = new UploadPartCommand(params);
    const { ETag } = await this.s3Client.send(command);
    return { ETag, PartNumber: partNumber };
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    const command = new CompleteMultipartUploadCommand(params);
    await this.s3Client.send(command);

    return this.getPermanentUrl(key);
  }

  getPermanentUrl(key: string): string {
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    const region = this.configService.get('AWS_REGION');
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
}

@Injectable()
export class AwsS3V2Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(
    file: Buffer,
    key: string,
    mimetype: string,
  ): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: file,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }

  async initiateMultipartUpload(
    key: string,
    contentType: string,
  ): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    };

    const { UploadId } = await this.s3.createMultipartUpload(params).promise();
    return UploadId;
  }

  async uploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
    body: Buffer,
  ): Promise<{ ETag: string; PartNumber: number }> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: body,
    };

    const { ETag } = await this.s3.uploadPart(params).promise();
    return { ETag, PartNumber: partNumber };
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    const { Location } = await this.s3
      .completeMultipartUpload(params)
      .promise();
    return Location;
  }

  getPermanentUrl(key: string): string {
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    const region = this.configService.get('AWS_REGION');
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
}
