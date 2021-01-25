/** @format */
import storeImageHttpTrigger from './index';
import { base64String, incorrectBase64String, dataUri, incorrectDataUri } from '../testing/config';
const context = require('../testing/defaultContext');
const localSettings = require('../local.settings.json');

describe('Check base64 string or dataUri decode are right', () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, {
      STORAGE_ACCOUNT_NAME: localSettings.Values.STORAGE_ACCOUNT_NAME,
      STORAGE_ACCOUNT_KEY: localSettings.Values.STORAGE_ACCOUNT_KEY,
      AzureWebJobsStorage: localSettings.Values.AzureWebJobsStorage,
      DATABASE_CONNECTION_TYPE: localSettings.Values.DATABASE_CONNECTION_TYPE,
      DATABASE_CONNECTION_HOST: localSettings.Values.DATABASE_CONNECTION_HOST,
      DATABASE_CONNECTION_USERNAME: localSettings.Values.DATABASE_CONNECTION_USERNAME,
      DATABASE_CONNECTION_PASSWORD: localSettings.Values.DATABASE_CONNECTION_PASSWORD,
    });
  });

  test('Body equal base64 string.', async () => {
    const request = {
      body: {
        blobInfo: {
          name: 'base64String',
          fileExtension: 'png',
          contentType: 'image/png',
          dataUriOrBase64String: base64String,
          containerName: 'outcontainer',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(200);
    expect(responseBody.name).toEqual('Success');
    expect(responseBody.message).toEqual('Upload and database insert success!');
  });

  test('Body equal incorrect base64 string.', async () => {
    const request = {
      body: {
        blobInfo: {
          name: 'IncorrectBase64String',
          fileExtension: 'png',
          contentType: 'image/png',
          dataUriOrBase64String: incorrectBase64String,
          containerName: 'outcontainer',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('string decode failed');
    expect(responseBody.message).toEqual('Failed decode.');
  });
  test('Body equal data uri.', async () => {
    const request = {
      body: {
        blobInfo: {
          name: 'dataUri',
          fileExtension: 'png',
          contentType: 'image/png',
          dataUriOrBase64String: dataUri,
          containerName: 'outcontainer',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(200);
    expect(responseBody.name).toEqual('Success');
    expect(responseBody.message).toEqual('Upload and database insert success!');
  });

  test('Body equal incorrect data uri.', async () => {
    const request = {
      body: {
        blobInfo: {
          name: 'IncorrectDataUri',
          fileExtension: 'png',
          contentType: 'image/png',
          dataUriOrBase64String: incorrectDataUri,
          containerName: 'outcontainer',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('string decode failed');
    expect(responseBody.message).toEqual('Failed decode.');
  });
});

describe('Check request body data', () => {
  test('Empty request body', async () => {
    const request = {
      body: {},
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('request shortage');
    expect(responseBody.message).toEqual('Request body shortage:[blobInfo]');
  });

  test('Request body has only name', async () => {
    const request = {
      body: {
        blobInfo: {
          name: 'sample',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('request shortage');
    expect(responseBody.message).toEqual(
      'Request body shortage:[fileExtension,contentType,dataUriOrBase64String,containerName]'
    );
  });

  test('Request body has only fileExtension', async () => {
    const request = {
      body: {
        blobInfo: {
          fileExtension: 'png',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('request shortage');
    expect(responseBody.message).toEqual(
      'Request body shortage:[name,contentType,dataUriOrBase64String,containerName]'
    );
  });

  test('Request body has only contentType', async () => {
    const request = {
      body: {
        blobInfo: {
          contentType: 'image/png',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('request shortage');
    expect(responseBody.message).toEqual(
      'Request body shortage:[name,fileExtension,dataUriOrBase64String,containerName]'
    );
  });

  test('Request body has only dataUriOrBase64String', async () => {
    const request = {
      body: {
        blobInfo: {
          dataUriOrBase64String: 'sample',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('request shortage');
    expect(responseBody.message).toEqual('Request body shortage:[name,fileExtension,contentType,containerName]');
  });

  test('Request body has only containerName', async () => {
    const request = {
      body: {
        blobInfo: {
          containerName: 'container',
        },
      },
    };

    await storeImageHttpTrigger(context, request);
    const responseBody = JSON.parse(context.res.body);

    expect(context.res.status).toEqual(400);
    expect(responseBody.name).toEqual('request shortage');
    expect(responseBody.message).toEqual(
      'Request body shortage:[name,fileExtension,contentType,dataUriOrBase64String]'
    );
  });
});
