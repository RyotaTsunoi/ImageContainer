/** @format */
import { parse } from 'qs';

export type RequestBody = {
  blobInfo: {
    name: string;
    fileExtension: string;
    contentType: string;
    dataUriOrBase64String: string;
    containerName: string;
  };
};

/**
 * @class
 * @classdesc Manage StoreImage function request body.
 */
export class StoreImageRequestBody {
  readonly parsedBody: RequestBody;

  /**
   * Database class Constractor
   * @constructor
   * @param {string} rawBody request.rawBody
   */
  constructor(rawBody: string) {
    this.parsedBody = parse(rawBody);
  }

  /**
   * Check body param is right.
   * @constructor
   * @param none
   * @return {string} if incorrect body param, return shortage param names.
   */
  checkRequestBodyParams = (): string => {
    if (!this.parsedBody.blobInfo) {
      return 'blobInfo';
    }
    const shortageBodyCheck: string[] = [];
    !this.parsedBody.blobInfo.name ? shortageBodyCheck.push('name') : '';
    !this.parsedBody.blobInfo.fileExtension ? shortageBodyCheck.push('fileExtension') : '';
    !this.parsedBody.blobInfo.contentType ? shortageBodyCheck.push('contentType') : '';
    !this.parsedBody.blobInfo.dataUriOrBase64String ? shortageBodyCheck.push('dataUriOrBase64String') : '';
    !this.parsedBody.blobInfo.containerName ? shortageBodyCheck.push('containerName') : '';

    return shortageBodyCheck.join(',');
  };
}
