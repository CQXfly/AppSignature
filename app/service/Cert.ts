import { Service } from 'egg';

/**
 * Test Service
 */
export default class Cert extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }

  public async certProvisionid(cert_udid: string) {
    return await this.ctx.model.Certification.findOne({
        where: {
            cert_udid,
        },
    });
  }
}
