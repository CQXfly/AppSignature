// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApp from '../../../app/service/App';
import ExportCert from '../../../app/service/Cert';
import ExportDevice from '../../../app/service/Device';
import ExportUser from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    app: ExportApp;
    cert: ExportCert;
    device: ExportDevice;
    user: ExportUser;
  }
}
