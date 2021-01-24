/** @format */
import storeImageHttpTrigger from './index';
const context = require('../testing/defaultContext');

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

  test('Request body only base64data', async () => {
    const request = {
      rawBody: { base64data: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[containerName,blobname,extension,createdAt,blobcontenttype]'
    );
  });

  test('Request body only containerName', async () => {
    const request = {
      rawBody: { containerName: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual('Request body shortage:[base64data,blobname,extension,createdAt,blobcontenttype]');
  });

  test('Request body only blobname', async () => {
    const request = {
      rawBody: { blobname: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,extension,createdAt,blobcontenttype]'
    );
  });

  test('Request body only extension', async () => {
    const request = {
      rawBody: { extension: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,blobname,createdAt,blobcontenttype]'
    );
  });

  test('Request body only createdAt', async () => {
    const request = {
      rawBody: { createdAt: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual(
      'Request body shortage:[base64data,containerName,blobname,extension,blobcontenttype]'
    );
  });

  test('Request body only blobcontenttype', async () => {
    const request = {
      rawBody: { blobcontenttype: 'sample' },
    };

    await storeImageHttpTrigger(context, request);

    expect(context.res.status).toEqual(400);
    expect(context.res.body).toEqual('Request body shortage:[base64data,containerName,blobname,extension,createdAt]');
  });
});
