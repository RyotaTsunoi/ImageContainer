import { toByteArray } from 'base64-js';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlockBlobParallelUploadOptions,
  BlockBlobClient,
} from '@azure/storage-blob';
import { RequestBody } from './StoreImageRequestBody';
import { ManageStorageIdentity } from './ManageIdentity';

/**
 * @class
 * @classdesc Access to Azure blob storage from Azure function
 */
export class BlobStorage {
  private sharedKeyCredential: StorageSharedKeyCredential;
  private blobServiceClient: BlobServiceClient;
  private requestBody: RequestBody;

  /**
   * Blob storage factory.
   * @function
   * @param {RequestBody} requestBody HttPRequestBody
   * @return {Promise<BlobStorage>} BlobStorage
   */
  static async blobStorageFactory(requestBody: RequestBody): Promise<BlobStorage> {
    const credential = await ManageStorageIdentity.manageStorageIdentityFactory();
    return new BlobStorage(requestBody, credential);
  }

  /**
   * BlobStorage class Constractor
   * @constructor
   * @param {RequestBody} requestBody HttPRequestBody
   */
  constructor(requestBody: RequestBody, credential: ManageStorageIdentity) {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      credential.storageAccountName,
      credential.storageAccountKey
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${credential.storageAccountName}.blob.core.windows.net`,
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
        createDateTime: new Date().toISOString(),
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
    const containeName = this.requestBody.blobInfo.containerName;
    const containerClient = this.blobServiceClient.getContainerClient(containeName);

    // Create blob options
    const blobOption = this.createBlobBlobUploadOptions();

    // Create a blob
    const blobname = this.requestBody.blobInfo.name;
    const extension = this.requestBody.blobInfo.fileExtension;
    const blobFileName = `${blobname}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobFileName);

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
