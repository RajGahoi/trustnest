import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint '${req.method} ${req.originalUrl}' does not exist on TrustNest API.`
    }
  });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal error occurred.';

  if (statusCode === 500) {
    console.error(`[Unhandled Error] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message
    }
  });
}
