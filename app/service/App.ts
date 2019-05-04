import { Service } from 'egg';

/**
 * Test Service
 */
export default class App extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }

  public async app_is_register(appName: string) {

    try {
      const r: any = await this.ctx.model.Appmodel.findOne({
        where: {
          app_name: appName,
        },
      });
      return r;
    } catch (e) {
      return null;
    }
  }

  public async device_count(appName: string) {
    const r: any = await this.ctx.app.model.query("SELECT app_name , COUNT(*) as 'num' FROM devices  WHERE app_name = :app_name GROUP BY app_name;", {
      replacements: {
        app_name: appName,
      },
    });

    return r;
  }
}
