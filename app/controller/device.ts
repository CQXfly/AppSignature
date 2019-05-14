import { Controller } from 'egg';

import Result from '../helper/result';
import { createRuleUploadAppDevice } from '../helper/validRule';
import moment = require('moment');

export default class DeviceController extends Controller {
    public async index() {
      const { ctx } = this;
      ctx.model.Test.findAll();
      ctx.body = await ctx.service.user.sayHi('egg');
    }

    public async getUserList() {

    }

    //   {
//     appName = "\U7ade\U535aJBO";
//     bundleVersion = 1;
//     bundleid = "com.gb2bcS.JBO";
//     devUdid = "FDED9F7F-D691-42E1-8D91-A297387E2D7F";
//     deviceIp = "10.0.0.8";
//     deviceMAC = ACBC327C37A1;
//     deviceName = "iPhone XS";
//     ispName = "no ispName";
//     model = "iPhone Simulator";
//     noncestr = 1556361681108;
//     osVersion = "iOS12.1";
//     platform = 2;
//     provisionName = "not readable";
//     version = "1.0";
// }
    public async uploadAppDeviceInfo() {
    const { ctx } = this;
    ctx.validate(createRuleUploadAppDevice, ctx.request.body);
    ctx.logger.info(`${ctx.request.body}`);
    const { appName, bundleVersion, bundleid, devUdid,
            deviceIp, deviceName, ispName, model, noncestr,
            osVersion, provisionName, version, certCompany} = ctx.request.body;
    const t = (new Date()).getTime();
    ctx.logger.info(noncestr);
    // 查询设备是否存过
    try {
        // 查询是否与app绑定
        const appmodel: any = await ctx.model.Appmodel.findOne({
          where: {
              app_name: appName,
              bundle_version: bundleVersion,
              bundleid,
          },
        });

        if (appmodel === null) {
          ctx.body = Result.default(400, '不存在该app');
          return;
        }

        const r: any = await ctx.model.Devicemodel.findOne({
          where: {
            dev_udid: devUdid,
            appid: appmodel.id,
          },
        });

        const rx: any[] = await ctx.app.model.query('SELECT appid , COUNT(*) as num FROM devices  WHERE appid = :appid GROUP BY appid;', {
          replacements: {
            appid: appmodel.id,
          },
        });
        const r0 = rx[0][0];
        console.log(r0);
        if (Number(r0.num) > appmodel.max_install_num) {
            ctx.body = Result.error(300, `dnmerror: currentusernum: ${r0.num}`);
            return;
       }

        if (r === null) {
          // 存入数据库
          const r0 = await ctx.model.Devicemodel.upsert({
              appid: appmodel.id,
              app_name: appName,
              dev_udid: devUdid,
              isp_name: ispName,
              model,
              noncestr: t,
              deviceip: deviceIp,
              device_name: deviceName,
              os_version: osVersion,
              provision_name: provisionName,
              version,
              cert_company: certCompany,
          });
          ctx.body = Result.default(200, r0 ? '绑定成功' : '绑定失败');
        } else {
           const p1 = ctx.model.Devicemodel.update({
              appid: appmodel.id,
              app_name: appName,
            }, {
                where: {
                  dev_udid: devUdid,
                },
            });

           const p2 = ctx.model.Certification.upsert({
              provision_name: provisionName,
            });
           await Promise.all([ p1, p2 ]);

           ctx.body = Result.default(200, '上传成功');
        }
    } catch (err) {
      ctx.body = Result.error(400, 'error');
    }

  }

  // 日活
    public async DayActive() {
    const { ctx } = this;
    const start = moment().startOf('day').valueOf();
    const end = moment().endOf('day').valueOf();
    try {
        const count = await ctx.service.device.activeCount(start, end);
        return ctx.body = Result.Sucess({
            dayActive: count,
        });
    } catch (e) {
        ctx.body = Result.ServerError();
    }

  }

      // 月活
    public async WeekActive() {
        const { ctx } = this;
        const start = moment().startOf('week').valueOf();
        const end = moment().endOf('week').valueOf();
        try {
            const count = await ctx.service.device.activeCount(start, end);
            return ctx.body = Result.Sucess({
                weekActive: count,
            });
        } catch (e) {
            ctx.body = Result.ServerError();
        }
      }

    // 月活
    public async MounthActive() {
        const { ctx } = this;
        const start = moment().startOf('month').valueOf();
        const end = moment().endOf('month').valueOf();
        try {
            const count = await ctx.service.device.activeCount(start, end);
            return ctx.body = Result.Sucess({
                dayActive: count,
            });
        } catch (e) {
            ctx.body = Result.ServerError();
        }
      }

    public async DeviceEnable() {
      return 1;
    }

    public async allDevices() {
      const r = await this.ctx.model.Devicemodel.findAll({
        order: [
          [ 'id', 'Asc' ],
        ],
      });
      this.ctx.body = Result.Sucess(r);
    }
}
