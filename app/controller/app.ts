import { Controller } from 'egg';
import { Op } from 'sequelize';
import { cry_md5 } from '../helper/crypto';
import Result from '../helper/result';
import * as moment from 'moment';
import { createRuleAppName, createRuleShowMessage, createRuleValidDay, createRuleMaxSupportDevice,
     createRuleAppStatus, createRuleUploadAppInfo, createRulePage, createRuleAppNameBundleId } from '../helper/validRule';
import { Promise } from 'bluebird';

// 1、查询APP是否注册，是否到期，并返回服务器存储的签名所使用的证书名字、公司名字、用户名
// 2、注册/更新App接口(证书信息也可以在这里创建)

// 签名工具调用
// 数据库中没有就新注册，有就更新

// 1、APP列表、并且能根据到期时间、最大用户量等进行排序 /分页返回
// 2、搜索APP
// 3、删除APP接口
// 3、修改显示信息、showurl、forceEnable
// 4、修改APP有效时间接口
// 5、修改APP最大支持用户数接口
// 6、根据到期时间、当前最大用户量的排序
// 7、查询证书列表及其下的所有用户总量/月/日活
// 8、查询某个证书下的所有APP

// （未实现、可选）
// 9、每个APP日新增、月活
// 10、今日、这周活跃用户数量
// 11、获取用户列表

export default class AppController extends Controller {
  public async index() {// 根据到期时间、最大用户量
    const { ctx } = this;
    ctx.model.Test.findAll();
    ctx.body = await ctx.service.app.sayHi('egg');
  }

// Post
// {
//     appName = "\U6885\U5c71\U6e38\U620f";
//     bundleid = "com.eagle.meishan";
// }

  public async uploadAppStatus() {
    const { ctx } = this;
    ctx.logger.info(ctx.request.body);
    ctx.validate(createRuleAppStatus, ctx.request.body);
    const { appName, bundleid } = ctx.request.body;
    // 查询app 是否注册过
    try {
        const r: any = await ctx.model.Appmodel.findOne({
                            where: {
                                app_name: appName,
                                bundleid,
                            },
                        });
        if (r === null) {
            const result = new Result();
            result.code = 404;
            result.message = 'app未注册，请联系(3469019435)';
            ctx.body = result;
            return;
        }
        // 判断 endtime 与现在。
        const endTime = r.end_time;
        const curr = Date.parse(moment(new Date()).format('YYYY-MM-DD hh:mm'));
        const canUse = endTime > curr;

        ctx.body = Result.Sucess({
            canUse,
            isForce: Boolean(r.is_froce),
            showMsg: r.show_msg,
            showUrl: r.show_url,
        });

    } catch (e) {
        ctx.logger.error(e);
    }

  }

  public async updateAppInfo() {
      const { ctx } = this;
      ctx.validate(createRuleUploadAppInfo, ctx.request.body);
      ctx.logger.info('register');

      const { appName, bundleid, bundleVersion,
              certUdid, cerName, provisionName,
              expirationDate, provisionType, maxInstallNum} = ctx.request.body;
      // app是否注册
      const registerApp = await ctx.service.app.app_is_register(appName, bundleid);

      let uplogs: any[];
      let code = 200;
      let msg = '注册成功';
      const startTime = (new Date()).getTime();
      if (registerApp === null) {
          uplogs = [];
      } else {
        uplogs = registerApp.update_logs;
        code = 201;
        msg = '更新成功';
      }
      uplogs.push({
              appName,
              bundleVersion,
              cerName,
              provisionName,
              startTime,
          });
      const appCardid = cry_md5(`${appName}${bundleid}`);

      try {
        const p1 = ctx.model.Appmodel.upsert({
            app_card_id: appCardid,
            app_name: appName,
            bundleid,
            bundle_version: bundleVersion,
            provision_name: provisionName,
            valid_day: 30,
            start_time: startTime,
            end_time: startTime + 30 * 24 * 60 * 60 * 1000,
            update_logs: uplogs,
            maxInstallNum,
          });

        const p2 = ctx.model.Certification.upsert({
            cert_udid: certUdid,
            cert_name: cerName,
            provision_name: provisionName,
            provision_type: provisionType,
            expiration_data: expirationDate,
          });

        await Promise.all([ p1, p2 ]);
        // 更新
        const r3 = await ctx.model.Certification.findOne({
            where: {
                cert_udid: certUdid,
            },
        });

        ctx.model.Appmodel.update({
            provision_id: r3.id,
        }, {
            where: {
                app_name: appName,
                bundleid,
            },
        });

        ctx.body = Result.default(code, msg);
      } catch (error) {

        ctx.body = Result.ServerError();
      }

  }
  public async findAppStatus() {
      const { ctx } = this;
      ctx.logger.info('register');
      ctx.validate(createRuleAppNameBundleId, ctx.query);
      const { appName, bundleid } = ctx.query;
      const registerApp = await ctx.service.app.app_is_register(appName, bundleid);
      if (registerApp === null) {
          ctx.body = Result.error(400, 'app未注册，请联系(3469019435)');
          return;
      } else {
        // 是否到期
        const endTime = registerApp.end_time;
        const curr = Date.parse(moment(new Date()).format('YYYY-MM-DD hh:mm'));

        // 签名所使用的信息
        const p1 = ctx.model.Certification.findOne({
            attributes: [ 'provision_name', 'cert_name', ],
            where: {
                id: registerApp.provision_id,
            },
        });

        const p2 = ctx.service.device.deviceCount(registerApp.id);
        try {
        const rl = await Promise.all([ p1, p2 ]);
        const r = rl[0];
        const number = rl[1];

        if (registerApp.userid !== null) {
            // 未绑定
            const r2: any = await ctx.model.Usermodel.findOne({
                where: {
                    id: registerApp.userid,
                },
            });

            ctx.body = Result.Sucess(Object.assign(r === null ? {} : r.dataValues, {
                userName: r2.userAccount,
                isValid: endTime < curr,
                start_time: registerApp.start_time,
                end_time: registerApp.end_time,
           }));
            return;
        }
        ctx.body = Result.Sucess(Object.assign(r === null ? {} : r.dataValues, {
            appName: registerApp.app_name,
            isValid: endTime < curr,
            deviceNumber: number,
            start_time: registerApp.start_time,
            end_time: registerApp.end_time,
       }));
        } catch (e) {
        this.logger.error(e);
        }
    }
  }

  public async registerApp() {
      const { ctx } = this;
      ctx.logger.info('register');
      const param = ctx.request.body;
      const appCardid = cry_md5(`${param.appName}${param.bundleid}`);
      ctx.model.Appmodel.upsert({
        app_card_id: appCardid,
        provision_id: 123,
        is_open: false,
        userid: 123,
        sign_type: '123',
        sign_price: 123,
        app_name: '123',
        bundleid: '123',
        bundle_version: '123',
        cert_company: '13',
        provision_name: '123',
        valid_day: '3132',
        mark_message: '13',
        start_time: 1313,
        end_time: 12313,
        update_logs: '123',
        show_msg: '1231',
        show_url: '12313',
        max_install_num: 123,
        current_user_num: 313,
        user_contact: 131321,
      });
  }

  public async updateApp() {
    const { ctx } = this;
    ctx.logger.info('updateAppInfo');
    const param = ctx.request.body;
    const appCardid = cry_md5(`${param.appName}${param.bundleid}`);
    ctx.model.Appmodel.upsert({
        app_card_id: appCardid,
        provision_id: 123,
        is_open: false,
        userid: 123,
        sign_type: '123',
        sign_price: 123,
        app_name: '123',
        bundleid: '123',
        bundle_version: '123',
        cert_company: '13',
        provision_name: '123',
        valid_day: '3132',
        mark_message: '13',
        start_time: 1313,
        end_time: 12313,
        update_logs: '123',
        show_msg: '1231',
        show_url: '12313',
        max_install_num: 123,
        current_user_num: 313,
        user_contact: 131321,
        is_froce: true,
      });
  }

  public async search() {
    const { ctx } = this;
    ctx.logger.info(ctx.query);
    ctx.validate(Object.assign(createRuleAppName, createRulePage), ctx.query);
    const { appName } = ctx.query;
    const { index, size } = ctx.query;
    if (Number(index) < 1 || Number(size) < 0) {
      ctx.body = Result.error(400, 'index or size error. check it');
      return;
    }
    // if (appName == null) {
    //     ctx.body = Result.error(400, '缺省参数 appName');
    //
    try {
        const r = await ctx.model.Appmodel.findAll({
            where: {
                app_name: { [Op.like]: `%${appName}%` },
            },

            order: [
                [ 'id', 'ASC' ],
            ],
            offset: (Number(index) - 1) * Number(size),
            limit: Number(size),
        });

        const all_count = await ctx.model.Appmodel.count({
            where: {
                app_name: { [Op.like]: `%${appName}%` },
            },
        });
        // TODO:
        // 查出每个的current_install_num
        const ids = r.map(item => {
            return item.id;
        });
        const nums = await ctx.service.device.deviceCounts(ids);
        r.forEach((item, index) => {
            Object.assign(item, {
                current_device_num: nums[index],
            });
        });
        ctx.body = Result.SucessCount(r, all_count);
    } catch (error) {
        ctx.body = Result.ServerError();
    }
  }

  public async delete() {
    const { ctx } = this;
    ctx.logger.info(ctx.query);
    ctx.validate(createRuleAppNameBundleId, ctx.query);
    const { appName, bundleid } = ctx.query;
    try {
        const r = await ctx.model.Appmodel.destroy({
            where: {
                app_name: appName,
                bundleid,
            },
        });
        ctx.body = Result.default(r === 1 ? 200 : 201, r === 1 ? '删除成功' : '删除失败');
    } catch (e) {
        ctx.body = Result.ServerError();
    }
  }

  public async updateShowMessage() {
    const { ctx } = this;
    ctx.logger.info(ctx.request.body);
    ctx.validate(createRuleAppNameBundleId, ctx.request.body);
    ctx.validate(createRuleShowMessage, ctx.request.body);
    const { appName, showMsg, showUrl, forceEnable, bundleid } = ctx.request.body;
    try {
        const r = await ctx.model.Appmodel.findOne({
            where: {
                app_name: appName,
                bundleid,
            },
        });
        if (r === null) {
            ctx.body = Result.error(404, '没有查到该app');
            return;
        }

        await ctx.model.Appmodel.update({
            show_msg: showMsg,
            show_url: showUrl,
            if_force: forceEnable,
        }, {
            where: {
                app_name: appName,
            },
        });

        ctx.body = Result.default();
    } catch (err) {
        ctx.body = Result.error(400, '更新失败');
    }
  }

  public async updateValidDay() {
    const { ctx } = this;
    ctx.logger.info(ctx.request.body);
    ctx.validate(createRuleAppNameBundleId, ctx.request.body);
    ctx.validate(createRuleValidDay, ctx.request.body);
    const { appName, validDay, bundleid } = ctx.request.body;
    try {

        const r = await ctx.model.Appmodel.findOne({
            where: {
                app_name: appName,
                bundleid,
            },
        });
        if (r === null) {
            ctx.body = Result.error(404, '没有查到该app');
            return;
        }

        const endTime = Number(r.start_time) + (validDay * 24 * 60 * 60 * 1000);

        await ctx.model.Appmodel.update({
            valid_day: validDay,
            end_time: endTime,
        }, {
            where: {
                app_name: appName,
                bundleid,
            },
        });

        ctx.body = Result.Sucess({
            endTime,
        });
    } catch (err) {
        console.log(err);
        ctx.body = Result.error(400, '更新失败');
    }
  }

  public async getDeviceList() {
    const { ctx } = this;
    ctx.validate(Object.assign(createRuleAppNameBundleId, createRulePage), ctx.query);
    const { appName, bundleid, index, size } = ctx.query;
    if (Number(index) < 1 || Number(size) < 0) {
        ctx.body = Result.error(400, 'index or size error. check it');
        return;
      }
    try {
        const appmodel: any = await ctx.model.Appmodel.findOne({
            where: {
                app_name: appName,
                bundleid,
            },
            order: [
                [ 'id', 'ASC' ],
            ],

            offset: (Number(index) - 1) * Number(size),
            limit: Number(size),
        });

        if (appmodel === null) {
            ctx.body = Result.error(400, '无该app');
            return;
        }

        const res = await ctx.model.Devicemodel.findAll({
            where: {
                appid: appmodel.id,
            },
        });
        ctx.body = Result.Sucess(res);
    } catch (error) {
        ctx.logger.error(error);
        ctx.body = Result.error(400, 'error');
    }
  }

  public async updateMaxSupportDevice() {
    const { ctx } = this;
    ctx.logger.info(ctx.request.body);
    ctx.validate(createRuleAppNameBundleId, ctx.request.body);
    ctx.validate(createRuleMaxSupportDevice, ctx.request.body);
    const { appName, maxInstallNum, bundleid } = ctx.request.body;
    try {
        const r = await ctx.model.Appmodel.findOne({
            where: {
                app_name: appName,
                bundleid,
            },
        });
        if (r === null) {
            ctx.body = Result.error(404, '没有查到该app');
            return;
        }
        let origin = r.max_install_num;
        const current_device_num = await ctx.service.device.deviceCount(r.id);
        origin = Math.max(origin, current_device_num);
        // 查出 deviceCount limit数量
        const offset = (Math.min(origin, maxInstallNum) - 1) < 1 ? 0 : (Math.min(origin, maxInstallNum) - 1);
        const f0 = await ctx.model.Devicemodel.findAll({
            offset,
            limit: 1,
            order: [
                [ 'id', 'Asc' ],
            ],
        });
        // 5000 -> 2000； 2000 -> 5000
        if (f0.length > 0) {
            const f0id = f0[0].id;
            await ctx.model.Devicemodel.update({
                forbidden: origin > maxInstallNum,
            }, {
                where: {
                    appid: r.id,
                    id: {
                        [Op.gte]: f0id,
                    },
                },
            });
            // 对小于最大数的进行更新
            await ctx.model.Devicemodel.update({
                forbidden: false,
            }, {
                where: {
                    appid: r.id,
                    id: {
                        [Op.lte]: f0id,
                    },
                },
            });
        }

        await ctx.model.Appmodel.update({
            max_install_num: maxInstallNum,
        }, {
            where: {
                app_name: appName,
                bundleid,
            },
        });
        // 根据最大数去修改目前已存的设备数可用量

        ctx.body = Result.default();
    } catch (err) {
        this.logger.error(err);
        ctx.body = Result.error(400, '更新失败');
    }
  }

  /**
   * pageSize
   * pageIndex
   */
  public async getAppList() {
      const { ctx } = this;
      ctx.validate(createRulePage, ctx.query);
      const { index, size } = ctx.query;
      if (Number(index) < 1 || Number(size) < 0) {
        ctx.body = Result.error(400, 'index or size error. check it');
        return;
      }
      try {
        const r = await ctx.model.Appmodel.findAll({
            order: [
                [ 'max_install_num', 'DESC' ],
                [ 'end_time', 'DESC' ],
            ],
            offset: (Number(index) - 1) * Number(size),
            limit: Number(size),
        });

        const all_count = await ctx.model.Appmodel.count();

        const ids = r.map(item => {
            return item.id;
        });
        const nums = await ctx.service.device.deviceCounts(ids);
        r.forEach((item, index) => {
            Object.assign(item, {
                current_device_num: nums[index],
            });
        });
        ctx.body = Result.SucessCount(r, all_count, true);
      } catch (e) {
        ctx.body = Result.error(400, 'fuck');
      }
  }

  public async dayGrowth() {
      const { ctx } = this;
      ctx.validate(createRuleAppNameBundleId, ctx.query);
      const { appName, bundleid } = ctx.query;
      const startTime = moment().startOf('D').valueOf();
      const endTime = moment().endOf('D').valueOf();

      const r0 = await ctx.model.Appmodel.findOne({
          where: {
              app_name: appName,
              bundleid,
          },
      });
      if (r0 === null) {
          ctx.body = Result.error(404, `not found app: ${appName}\n bundleid: ${bundleid}`);
          return;
      }
      const r = await ctx.app.model.query('select app_name as appName, COUNT(*) as num from devices where appid = :appid and noncestr > :startTime and noncestr < :endTime group by app_name', {
          replacements: {
            appid: r0.id,
            startTime,
            endTime,
          },
      });
      ctx.body = Result.Sucess(r[0][0]);
  }

  public async appMonthActive() {
    const { ctx } = this;
    ctx.validate(createRuleAppNameBundleId, ctx.query);
    const { appName, bundleid } = ctx.query;
    const startTime = moment().startOf('M').valueOf();
    const endTime = moment().endOf('M').valueOf();
    try {
        const count = await ctx.service.device.appActiveCount(startTime, endTime, appName, bundleid);
        ctx.body = Result.Sucess({
            month: count,
        });
    } catch (e) {
        ctx.body = Result.ServerError();
    }

  }

}
