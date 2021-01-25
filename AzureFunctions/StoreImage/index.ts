/** @format */

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Database } from '../common/class/Database';
import { BlobStorage } from '../common/class/BlobStorage';
import { BlockBlobClient } from '@azure/storage-blob';
import { StoreImageRequestBody } from '../common/class/StoreImageRequestBody';

const storeImageHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // Parse request body
  const requestBody = new StoreImageRequestBody(req.body);
  const shortageCheckResult = requestBody.checkRequestBodyParams();

  //Shortage request body is error
  if (shortageCheckResult) {
    context.res = {
      status: 400,
      body: shortageCheckResult,
    };
    return;
  } else {
    context.log('request body check ok.');
  }

  //Upload blob storage
  const blobStorage = new BlobStorage(requestBody.parsedBody);
  const blockBlobClient = await blobStorage.uploadBlobStorage();
  if (typeof blockBlobClient === 'string') {
    context.res = {
      status: 400,
      body: blockBlobClient,
    };
    return;
  }

  //Insert database
  try {
    if (blockBlobClient instanceof BlockBlobClient) {
      const database = new Database();
      database.insertData(
        blockBlobClient.url,
        requestBody.parsedBody.blobInfo.name,
        requestBody.parsedBody.blobInfo.fileExtension,
        'sampleMetaData1'
      );
    }
  } catch {
    context.res = {
      status: 400,
      body: `Upload success! But insert database failed...`,
    };
    return;
  }

  context.res = {
    status: 200,
    body: `Upload and database insert success!`,
  };
};

export default storeImageHttpTrigger;
