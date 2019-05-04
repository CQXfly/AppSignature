// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAppmodel from '../../../app/model/appmodel';
import ExportCertification from '../../../app/model/certification';
import ExportDevicemodel from '../../../app/model/devicemodel';
import ExportSigntype from '../../../app/model/signtype';
import ExportTest from '../../../app/model/test';
import ExportUserApp from '../../../app/model/userApp';
import ExportUsermodel from '../../../app/model/usermodel';

declare module 'sequelize' {
  interface Sequelize {
    Appmodel: ReturnType<typeof ExportAppmodel>;
    Certification: ReturnType<typeof ExportCertification>;
    Devicemodel: ReturnType<typeof ExportDevicemodel>;
    Signtype: ReturnType<typeof ExportSigntype>;
    Test: ReturnType<typeof ExportTest>;
    UserApp: ReturnType<typeof ExportUserApp>;
    Usermodel: ReturnType<typeof ExportUsermodel>;
  }
}
