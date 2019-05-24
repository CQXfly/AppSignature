import { Controller } from 'egg';

import Result from '../helper/result';
import { createRuleProvisionUdid, createRulePage } from '../helper/validRule';
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
        ctx.validate(Object.assign(createRuleProvisionUdid, createRulePage), ctx.query);
        const { certUdid, index, size } = ctx.query;
        if (Number(index) < 1 || Number(size) < 0) {
            ctx.body = Result.error(400, 'index or size error. check it');
            return;
          }
        const id = await ctx.service.cert.certProvisionid(certUdid);
        if (id === null) {
            ctx.body = Result.error(404, '没有该证书');
            return;
        }
        const r = await ctx.model.Appmodel.findAll({
            where: {
                provision_id: id.id,
            },

            order: [
                [ 'id', 'ASC' ],
            ],

            offset: (Number(index) - 1) * Number(size),
            limit: Number(size),
        });
        ctx.body = Result.Sucess(r, false);
    }
}
