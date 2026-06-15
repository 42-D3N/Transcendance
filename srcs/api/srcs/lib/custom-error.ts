export class CustomError extends Error {
  message!: string;
  status: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;
  }
}