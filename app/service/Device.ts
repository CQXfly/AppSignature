import { Service } from 'egg';
import { Op } from 'sequelize';
/**
 * Test Service
 */
export default class Device extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }

  public async activeCount(startTime: number, endTime: number, provisionName?: string) {
    if (provisionName === undefined) {
        const r3 = await this.ctx.model.Devicemodel.findAll({
          where: {
            lastnoncestr: { [Op.gte]: startTime, [Op.lte]: endTime },
          },
        });
        return r3.length;
    }
    const r3 = await this.app.model.query('select count(*) as num from devices where provision_name = :provision_name and lastnoncestr > :startTime and lastnoncestr < :endTime group by provision_name', {
        replacements: {
            provision_name: provisionName,
            startTime,
            endTime,
        },
    });
    return r3[0][0];
  }

  public async appActiveCount(startTime: number, endTime: number, appName: string, bundleid: string) {
        const r3: any = await this.ctx.model.Devicemodel.count({
          where: {
            app_name: appName,
            bundleid,
            lastnoncestr: { [Op.gte]: startTime, [Op.lte]: endTime },
          },
        });
        return r3;
  }
}
