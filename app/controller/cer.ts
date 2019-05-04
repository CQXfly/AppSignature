import { Controller } from 'egg';

import Result from '../helper/result';
import { createRuleProvisionName } from '../helper/validRule';
import moment = require('moment');

export default class DeviceController extends Controller {
    public async getCertList() {
        const { ctx } = this;
        // const { startTime, endTime } = ctx.params;
        // 查询证书列表
        try {
            const r: any[] = await ctx.model.Certification.findAll();
            const result: any[] = [];
            for (const x of r) {
                // ctx.logger.info(x);
                // 证书下的设备总量
                const r2 = await ctx.app.model.query('select count(*) as num from devices where provision_name = :provision_name group by provision_name', {
                    replacements: {
                        provision_name: x.provision_name,
                    },
                });
                // 证书下的日活 lastnoncestr > startTime  < endTime;
                const dayS = moment().startOf('D').valueOf();
                const dayE = moment().endOf('D').valueOf();
                const monthS = moment().startOf('M').valueOf();
                const monthE = moment().endOf('M').valueOf();

                const p1 = await ctx.service.device.activeCount(dayS, dayE, x.provision_name);
                const p2 = await ctx.service.device.activeCount(monthS, monthE, x.provision_name);
                // 月活
                // const r3 = r2.filter(item => {
                //     return item.lastnoncestr > s
                // })
                console.log(r2[0][0]);
                const num = r2[0][0] ? r2[0][0].num : 0;
                result.push(Object.assign({
                    dayActive: p1,
                    mounthActive: p2,
                    deviceNum: num,
                }, x.dataValues));
            }
            console.log(result);
            ctx.body = Result.Sucess(result);
        } catch (e) {
            ctx.body = Result.ServerError();
        }
    }

    public async applist() {
        const { ctx } = this;
        ctx.validate(createRuleProvisionName, ctx.query);
        const { provisionName } = ctx.query;
        const r = await ctx.model.Appmodel.findAll({
            where: {
                provision_name: provisionName,
            },
        });
        ctx.body = Result.Sucess(r);
    }
}
