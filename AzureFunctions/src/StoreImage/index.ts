import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Database } from '../class/Database';
import { BlobStorage } from '../class/BlobStorage';
import { CustomResponse } from '../class/CustomeResponse';
import { BlockBlobClient } from '@azure/storage-blob';
import { StoreImageRequestBody } from '../class/StoreImageRequestBody';

const storeImageHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // Parse request body
  const requestBody = new StoreImageRequestBody(req.body);
  const shortageCheckResult = requestBody.checkRequestBodyParams();

  //Shortage request body is error
  if (shortageCheckResult) {
    context.res = new CustomResponse(400, 'request shortage', shortageCheckResult).response;
    return;
  } else {
    context.log('request body check ok.');
  }

  //Upload blob storage
  const blobStorage = await BlobStorage.blobStorageFactory(requestBody.parsedBody);
  const blockBlobClient = await blobStorage.uploadBlobStorage();
  if (typeof blockBlobClient === 'string') {
    context.res = new CustomResponse(400, 'string decode failed', blockBlobClient).response;
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
    context.res = new CustomResponse(400, 'database error', 'Upload success! But insert database failed...').response;
    return;
  }

  context.res = new CustomResponse(200, 'Success', 'Upload and database insert success!').response;
  return;
};

export default storeImageHttpTrigger;
