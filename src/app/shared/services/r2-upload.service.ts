import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root',
})
export class R2UploadService {
  private ACCOUNT_ID = '534c5fe802e61d53eb7c56a863d3ce7b';
  private ACCESS_KEY_ID = '205f8a3fe74fbcbf1e5a600a06538e74';
  private SECRET_ACCESS_KEY = '5255574538aa6e30b49f510e59ff5cd40a8dc078305f0b67ddeed53b7365408d';
  private BUCKET = 'myimprint';

  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${this.ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Uploads a base64 string as a file to R2
   * @param base64Data Base64 string of the file
   * @param fileName Optional custom file name
   * @param folder Optional folder path in bucket
   * @param contentType MIME type of the file
   * @returns Public URL of uploaded file
   */
  async uploadBase64(
    base64Data: string,
    fileName = 'file',
    folder = 'uploads',
    contentType = 'image/png',
    uniqueId: number
  ): Promise<string> {
    try {
      // Remove base64 prefix if present
      const base64 = base64Data.split(',')[1] ?? base64Data;
      const buffer = this.base64ToArrayBuffer(base64);

      // Generate unique file name
      const extension = contentType.split('/')[1] || 'png';
      const key = `${folder}/${uniqueId}_${fileName}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: this.BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3.send(command);

      const publicUrl = `https://${this.ACCOUNT_ID}.r2.cloudflarestorage.com/${this.BUCKET}/${key}`;
      console.log(`✅ Uploaded successfully: ${publicUrl}`);
      return publicUrl;
    } catch (err) {
      console.error('❌ Upload failed:', err);
      throw err;
    }
  }

  // Helper: Convert base64 string to ArrayBuffer
  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
