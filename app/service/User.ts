import { Service } from 'egg';

/**
 * Test Service
 */
export default class User extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }

  public async register(userAccount: string, email?: string) {
    return await this.ctx.model.Usermodel.upsert({
      userAccount,
      email,
    });
  }
}
