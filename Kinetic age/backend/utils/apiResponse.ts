export class ApiError extends Error {
  statusCode: number;
  errors: any[];

  constructor(statusCode: number, message = 'Something went wrong', errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
