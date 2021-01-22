/** @format */

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { BlobServiceClient, StorageSharedKeyCredential, BlobDownloadResponseModel } from '@azure/storage-blob';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  context.log(req);
  const blob = Buffer.from(req.body);
  const name = req.query.name || req.body.name;

  context.log;
  const responseMessage = name
    ? 'Hello, ' + name + '. This HTTP triggered function executed successfully.'
    : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
