/** @format */

import { toByteArray } from 'base64-js';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlockBlobParallelUploadOptions,
  BlockBlobClient,
} from '@azure/storage-blob';
import { RequestBody } from './StoreImageRequestBody';

/**
 * @class
 * @classdesc Access to Azure blob storage from Azure function
 */
export class BlobStorage {
  private readonly accountName = process.env.STORAGE_ACCOUNT_NAME;
  private readonly accountKey = process.env.STORAGE_ACCOUNT_KEY;
  private readonly sharedKeyCredential: StorageSharedKeyCredential;
  private readonly blobServiceClient: BlobServiceClient;
  private readonly requestBody: RequestBody;

  /**
   * BlobStorage class Constractor
   * @constructor
   * @param {requestBody} requestBody HttPRequestBody
   */
  constructor(requestBody: RequestBody) {
    this.sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
    this.blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      this.sharedKeyCredential
    );
    this.requestBody = requestBody;
  }

  /**
   * Replace dataURI header string.
   * @function
   * @param {string} base64String expected base64 string or data uri;
   * @return {string} base64String
   */
  private extractBase64String = (base64String: string): string => {
    return base64String.replace(/data:.*\/.*;base64,/, '');
  };

  /**
   * Create blob upload option params
   * @function
   * @return {BlockBlobParallelUploadOptions} BlockBlobParallelUploadOptions
   */
  private createBlobBlobUploadOptions = (): BlockBlobParallelUploadOptions => {
    return {
      metadata: {
        createdat: '2021-1-1',
      },
      blobHTTPHeaders: {
        blobContentType: this.requestBody.blobInfo.contentType,
      },
    };
  };

  /**
   * Upload contents to azure blob storage
   * @function
   * @return {Promise<BlockBlobClient>} Promise<BlockBlobClient>
   */
  async uploadBlobStorage(): Promise<BlockBlobClient | string> {
    //Extract base64 string if request.body.base64string is data uri.
    const base64String = this.extractBase64String(this.requestBody.blobInfo.dataUriOrBase64String);

    // Specify output container
    const containeName = this.requestBody.blobInfo.containerName || 'outputcontainer'; //outputcontainer is default container
    const containerClient = this.blobServiceClient.getContainerClient(containeName);

    // Create blob options
    const blobOption = this.createBlobBlobUploadOptions();

    // Create a blob
    const blobname = this.requestBody.blobInfo.name || 'SampleData';
    const extension = this.requestBody.blobInfo.fileExtension || 'png';
    const blobFileName = `${blobname}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobFileName);
    // Upload blob file. if decode failed, context.res return;
    try {
      const binaryData = toByteArray(base64String);
      const blobData = Buffer.from(binaryData);
      await blockBlobClient.uploadData(blobData, blobOption);
      return blockBlobClient;
    } catch {
      return 'Failed decode.';
    }
  }
}
