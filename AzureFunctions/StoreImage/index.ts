/** @format */

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Database } from '../common/class/Database';
import { BlobStorage } from '../common/class/BlobStorage';
import { CustomResponse } from '../common/class/CustomeResponse';
import { BlockBlobClient } from '@azure/storage-blob';
import { StoreImageRequestBody } from '../common/class/StoreImageRequestBody';

const storeImageHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // Parse request body
  const requestBody = new StoreImageRequestBody(req.body);
  const shortageCheckResult = requestBody.checkRequestBodyParams();

  //Shortage request body is error
  if (shortageCheckResult) {
    const customResponse = new CustomResponse(400, 'request shortage', shortageCheckResult);
    context.res = customResponse.response;
    return;
  } else {
    context.log('request body check ok.');
  }
  
  //Upload blob storage
  const blobStorage = await BlobStorage.blobStorageFactory(requestBody.parsedBody);
  const blockBlobClient = await blobStorage.uploadBlobStorage();
  if (typeof blockBlobClient === 'string') {
    const customResponse = new CustomResponse(400, 'string decode failed', blockBlobClient);
    context.res = customResponse.response;
    return;
  }

  //Insert database
  try {
    if (blockBlobClient instanceof BlockBlobClient) {
      const database = new Database();
      await database.insertData(
        blockBlobClient.url,
        requestBody.parsedBody.blobInfo.name,
        requestBody.parsedBody.blobInfo.fileExtension,
        'sampleMetaData1'
      );
    }
  } catch {
    const customResponse = new CustomResponse(400, 'database error', 'Upload success! But insert database failed...');
    context.res = customResponse.response;
    return;
  }

  const customResponse = new CustomResponse(200, 'Success', 'Upload and database insert success!');
  context.res = customResponse.response;
  return;
};

export default storeImageHttpTrigger;
