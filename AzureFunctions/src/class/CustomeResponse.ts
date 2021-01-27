/** @format */

type HttpTrigerResponse = {
  [key: string]: string | Date | number;
};

/**
 * @class
 * @classdesc Common response create class for image container functions.
 */
export class CustomResponse {
  private readonly responseStatus: number;
  private readonly responseName: string;
  private readonly responseDate: Date;
  private readonly resonseMessage: string;
  readonly response: HttpTrigerResponse;

  constructor(responseStatus: number, responseName: string, responseMessage: string, responseDate: Date = new Date()) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    this.responseStatus = responseStatus;
    this.responseName = responseName;
    this.resonseMessage = responseMessage;
    this.responseDate = responseDate;

    this.response = {
      status: this.responseStatus,
      body: JSON.stringify({
        name: this.responseName,
        message: this.resonseMessage,
        date: this.responseDate,
      }),
    };
  }
}
