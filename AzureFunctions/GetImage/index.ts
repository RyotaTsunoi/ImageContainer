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

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { StorageDataLink } from './src/entity/StorageDataLink';

const getImageHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request. /getimage');

  // Parse request body
  const parsedData = parse(req.rawBody);
  if (parsedData.name) {
    context.res = {
      status: 200,
      body: `Error`,
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    };
  }
};

export default getImageHttpTrigger;
