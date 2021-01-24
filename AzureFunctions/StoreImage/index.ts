/** @format */

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { parse } from 'qs';
import { toByteArray } from 'base64-js';
import 'reflect-metadata';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { StorageDataLink } from './src/entity/StorageDataLink';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlockBlobParallelUploadOptions,
  BlobUploadCommonResponse,
  BlockBlobClient,
} from '@azure/storage-blob';

type RequestBody = {
  base64data: string;
  containerName: string;
  blobname: string;
  extension: string;
  createdAt?: string;
  blobcontenttype: string;
} & Record<string, string | number | boolean>;

const storeImageHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');

  // Parse request body
  const parsedData: RequestBody = parse(req.rawBody);
  if (!parsedData.base64data) {
    context.res = {
      status: 400,
      body: 'Please send a base64 string in the request body',
    };
  }

  //Upload blob storage
  const blobStorage = new BlobStorage(parsedData);
  const blockBlobClient = await blobStorage.uploadBlobStorage();

  //Insert database
  try {
    const database = new Database();
    database.insertData(blockBlobClient.url, parsedData.blobname, parsedData.extension, 'sampleMetaData1');
  } catch {
    context.res = {
      status: 400,
      body: `Upload success! But insert database failed...`,
    };
  }

  context.res = {
    status: 200,
    body: `Upload and database insert success!`,
  };
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
   * @return {Promise<BlockBlobClient>} Promise<BlockBlobClient>
   */
  async uploadBlobStorage(): Promise<BlockBlobClient> {
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
    await blockBlobClient.uploadData(blobData, blobOption);
    return blockBlobClient;
  }
}

/**
 * @class
 * @classdesc Access to Azure SQL from Azure function
 */
class Database {
  private readonly connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DATABASE_CONNECTION_HOST,
    port: 5432,
    username: process.env.DATABASE_CONNECTION_USERNAME,
    password: process.env.DATABASE_CONNECTION_PASSWORD,
    database: 'postgres',
    entities: [__dirname + '\\src\\entity\\*.js'],
    synchronize: true,
    ssl: true,
  };

  /**
   * Database class Constractor
   * @constructor
   * @param none
   */
  constructor() {}

  /**
   * Create database connection
   * @function
   * @return {Promise<Connection>} Promise<Connection>
   */
  private async connectionBuilder(): Promise<Connection> {
    return createConnection(this.connectionOptions);
  }

  /**
   * Insert data
   * @function
   * @param {string} url blob storage url
   * @param {string} name blob name
   * @param {string} extension blob extension
   * @param {string} meta1 blob meta 1
   * @return Promise<void>
   */
  async insertData(url: string, name: string, extension: string, meta1: string): Promise<void> {
    const connection = await this.connectionBuilder();
    const repo = connection.getRepository(StorageDataLink);
    const storageDataLink = new StorageDataLink();
    storageDataLink.blob_url = url;
    storageDataLink.blob_name = name;
    storageDataLink.blob_extension = extension;
    storageDataLink.meta_1 = meta1;
    await repo.save(storageDataLink);
    connection.close();
  }
}

export default storeImageHttpTrigger;
