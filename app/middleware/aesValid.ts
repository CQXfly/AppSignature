
import { cry_daes } from '../helper/crypto';
import { Context, Application } from 'egg';

module.exports = (options, app: Application) => {
    return async function dAes(ctx: Context, next) {
        console.log(options);
        console.log(app);
        console.log(ctx);
        if (ctx.method === 'GET') {
            ctx.query = cry_daes(ctx.query.cry);
        } else {
            cry_daes(ctx.request.body.cry);
        }

        await next();
    };
};
