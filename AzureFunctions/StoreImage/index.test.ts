/** @format */
import storeImageHttpTrigger from './index';
import base64String from '../testing/config';
const context = require('../testing/defaultContext');

describe('Standard root', () => {
  test('Standard root', async () => {
    const request = {
      rawBody: {
        base64data: base64String,
        containerName: 'outcontainer',
        blobname: 'fromTestCode',
        extension: 'png',
        createdAt: '2021-01-21',
        blobcontenttype: 'image/png',
      },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(200);
    expect(context.res.body).toEqual('Upload and database insert success!');
  });
});

describe('Check request body data', () => {
  test('Empty request body', async () => {
    const request = {
      rawBody: {},
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,blobname,extension,createdAt,blobcontenttype]'
    );
  });

  test('Request body has only base64data', async () => {
    const request = {
      rawBody: { base64data: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[containerName,blobname,extension,createdAt,blobcontenttype]'
    );
  });

  test('Request body has only containerName', async () => {
    const request = {
      rawBody: { containerName: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual('Request body shortage:[base64data,blobname,extension,createdAt,blobcontenttype]');
  });

  test('Request body has only blobname', async () => {
    const request = {
      rawBody: { blobname: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,extension,createdAt,blobcontenttype]'
    );
  });

  test('Request body has only extension', async () => {
    const request = {
      rawBody: { extension: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,blobname,createdAt,blobcontenttype]'
    );
  });

  test('Request body has only createdAt', async () => {
    const request = {
      rawBody: { createdAt: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,blobname,extension,blobcontenttype]'
    );
  });

  test('Request body has only blobcontenttype', async () => {
    const request = {
      rawBody: { blobcontenttype: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual('Request body shortage:[base64data,containerName,blobname,extension,createdAt]');
  });
});
