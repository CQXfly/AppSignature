// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApp from '../../../app/controller/app';
import ExportCer from '../../../app/controller/cer';
import ExportDevice from '../../../app/controller/device';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    app: ExportApp;
    cer: ExportCer;
    device: ExportDevice;
    user: ExportUser;
  }
}
