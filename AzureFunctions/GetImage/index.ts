/** @format */

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { parse } from 'qs';
import { toByteArray } from 'base64-js';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlockBlobParallelUploadOptions,
  BlobUploadCommonResponse,
} from '@azure/storage-blob';

type RequestBody = {
  base64data: string;
  containerName: string;
  blobname: string;
  extension: string;
  createdAt?: string;
  blobcontenttype: string;
} & Record<string, string | number | boolean>;

const imageStoreHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');

  // Parse request body
  const parsedData: RequestBody = parse(req.rawBody);
  context.log(parsedData);

  if (parsedData.base64data) {
    const blobStorage = new BlobStorage(parsedData);
    const uploadBlobResponse = await blobStorage.uploadBlobStorage();
    context.log(`Upload block blob successfully`, uploadBlobResponse.requestId);
    context.res = {
      status: 200,
      body: `Upload success! RequestId:${uploadBlobResponse.requestId} ETag:${uploadBlobResponse.etag}`,
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    };
  }
};

/**
 * @class
 * @classdesc Access to Azure blob storage from Azure function
 */
class BlobStorage {
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
   * Create blob upload option params
   * @function
   * @return {BlockBlobParallelUploadOptions} BlockBlobParallelUploadOptions
   */
  private createBlobBlobUploadOptions = (): BlockBlobParallelUploadOptions => {
    return {
      metadata: {
        createdat: this.requestBody.createdAt,
      },
      blobHTTPHeaders: {
        blobContentType: this.requestBody.blobcontenttype,
      },
    };
  };

  /**
   * Upload contents to azure blob storage
   * @function
   * @return {Promise<BlobUploadCommonResponse>} Promise<BlobUploadCommonResponse>
   */
  async uploadBlobStorage(): Promise<BlobUploadCommonResponse> {
    // Specify output container
    const containeName = this.requestBody.containerName || 'outputcontainer'; //outputcontainer is default container
    const containerClient = this.blobServiceClient.getContainerClient(containeName);

    // Create blob options
    const blobOption = this.createBlobBlobUploadOptions();

    // Create a blob
    const blobname = this.requestBody.blobname || 'SampleData';
    const extension = this.requestBody.extension || 'png';
    const blobFileName = `${blobname}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobFileName);
    // Upload blob file
    const binaryData = toByteArray(this.requestBody.base64data);
    const blobData = Buffer.from(binaryData);
    return await blockBlobClient.uploadData(blobData, blobOption);
  }
}

export default imageStoreHttpTrigger;
