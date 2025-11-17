import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class R2UploadService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${environment.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: environment.r2AccessKeyId,
        secretAccessKey: environment.r2SecretAccessKey,
      },
    });
  }

  /**
   * upload object to R2
   */
  async uploadBase64Image(
    base64Data: string,
    folderName: string,
    fileName: string
  ): Promise<string> {
    console.log('fileName: ', fileName);
    const matches = base64Data.match(/^data:(.+);base64,(.*)$/);
    if (!matches || matches.length !== 3) throw new Error('Invalid base64 string format');

    const mimeType = matches[1];
    const base64Content = matches[2];
    const buffer = this.base64ToArrayBuffer(base64Content);
    const extension = this.getExtensionFromMime(mimeType);
    const key = `${folderName}/${fileName}.${extension}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: environment.Bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      const publicUrl = `https://pub-9b4cc8555df8437bacf8d3a7a25c1ab2.r2.dev/${key}`;
      console.log('✅ Uploaded successfully:', publicUrl);
      return folderName === 'custom-design-assets' ? publicUrl : key;
    } catch (err) {
      console.error('❌ Upload failed:', err);
      throw err;
    }
  }

  /**
   * delete object from R2
   * @param fileUrl
   */
  async deleteFileFromR2(fileUrl: string): Promise<void> {
    console.log('fileUrl: ', fileUrl);
    try {
      // Example fileUrl:
      // https://pub-9b4cc8555df8437bacf8d3a7a25c1ab2.r2.dev/custom-design-assets/decal_uuid.png
      const key = fileUrl.split('.r2.dev/')[1];
      if (!key) throw new Error('Invalid R2 file URL');

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: environment.Bucket,
          Key: key,
        })
      );

      console.log('🗑️ File deleted from R2:', key);
    } catch (err) {
      console.error('❌ Failed to delete file from R2:', err);
      throw err;
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes.buffer;
  }

  private getExtensionFromMime(mime: string): string {
    const map: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
    };
    return map[mime] || 'png';
  }
}
