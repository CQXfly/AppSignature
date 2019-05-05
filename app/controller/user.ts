import { Controller } from 'egg';
import Result from '../helper/result';
import { createRuleBindToApp, createRuleUserId } from '../helper/validRule';

// 1、上传APP信息，获取APP是否可以打开、打开显示信息、是否必须点击（用户前端显示，必须点击只有一个确定按钮，非必须可以点击取消）
// {
//     code = 400;
//     message = “app未注册，请联系(3469019435)";
// }//数据库中没有找到App信息
// 找到信息后
// {
//     code = 200;
//     data =     {
//         canUse = 0;  //关键点  可以使用返回1  不可使用返回0
//         isForce = 1;  //读取数据库字段返回
//         showMsg = "";
//         showUrl = "";
//     };
//     message = successful;
// }

// 2、上传设备、APP、证书信息后台用于收集信息，设备匹配查询是否已再数据库中？如果不在插入，并为其编号。如果在，查询是否已经与此APP绑定，未绑定增加绑定，并编号，已绑定则更新。  根据编号与最大用户量的对比，返回此设备能否可用
// （注：如果服务器中没有上传的证书信息，则为其创建一个）

// 如果没有超过最大设备量，则不用返回或者返回任意值
// 超过了 返回
// {
//     code = 300;
//     message = “dnmerror: currentusernum”;
// }
// currentusernum= 当前用户编号或者当前用户量

// 到达最大值后用邮件或者其它方式进行通知
// 四：用户端：（加密、在工具端口调用）
// 1、绑定APP到用户（用户没有注册接口，当App需要绑定到qq的时候，此用户也没有注册，则为其注册一个用户）
// 2、查询用户下面的App

export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.model.Test.findAll();
    ctx.body = await ctx.service.user.sayHi('egg');
  }

  public async getUserList() {
    const { ctx } = this;
    try {
      const r = await ctx.model.Usermodel.findAll();
      ctx.body = Result.Sucess(r);
    } catch (e) {
      ctx.body = Result.ServerError();
    }
  }

  public async getAppListByUser() {
    const { ctx } = this;
    ctx.validate(createRuleUserId, ctx.query);
    const { userid } = ctx.query;

    try {
      const r = await ctx.model.Appmodel.findAll({
        where: {
          userid,
        },
      });
      ctx.body = Result.Sucess(r);
    } catch (error) {
      ctx.body = Result.ServerError();
    }
  }

  public async register() {
    const { ctx } = this;
    ctx.validate(createRuleBindToApp, ctx.request.body);
    const { userAccount, email } = ctx.ctx.request.body;
    try {
      await ctx.service.user.register(userAccount, email);
      ctx.body = Result.default(200, '注册成功');
    } catch (e) {
      ctx.body = Result.ServerError();
    }
  }

  public async bindToApp() {
    const { ctx } = this;
    ctx.validate(createRuleBindToApp, ctx.request.body);
    const { userAccount, email, appName, bundleid } = ctx.request.body;

    try {
      let userid;
      const r: any = await ctx.model.Usermodel.findOne({
        where: {
          userAccount,
        },
      });
      if (r === null) {
        await ctx.service.user.register(userAccount, email);
        const r0: any = await ctx.model.Usermodel.findOne({
          where: {
            userAccount,
          },
        });
        userid = r0.id;
      } else {
        userid = r.id;
      }
      const x = await ctx.model.Appmodel.update({
        userid,
      }, {
        where: {
          app_name: appName,
          bundleid,
        },
      });
      ctx.body = Result.default(200, x[0] === 0 ? '绑定失败 请查看是否有该app' : '绑定成功');
    } catch (e) {
      ctx.body = Result.ServerError();
    }
  }
}
