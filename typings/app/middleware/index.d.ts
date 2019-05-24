// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAesValid from '../../../app/middleware/aesValid';
import ExportErrorHandler from '../../../app/middleware/error_handler';

declare module 'egg' {
  interface IMiddleware {
    aesValid: typeof ExportAesValid;
    errorHandler: typeof ExportErrorHandler;
  }
}
