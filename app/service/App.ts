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

  public async app_is_register(appName: string, bundleid: string) {

    try {
      const r: any = await this.ctx.model.Appmodel.findOne({
        where: {
          app_name: appName,
          bundleid,
        },
      });
      return r;
    } catch (e) {
      return null;
    }
  }

  public async device_count(appName: string, bundleid: string) {
    const r: any = await this.ctx.app.model.query("SELECT app_name , COUNT(*) as 'num' FROM devices  WHERE app_name = :app_name and bundleid = :bundleid GROUP BY app_name;", {
      replacements: {
        app_name: appName,
        bundleid,
      },
    });

    return r;
  }
}
