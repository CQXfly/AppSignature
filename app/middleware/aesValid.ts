
import { cry_daes } from '../helper/crypto';
import { Context, Application } from 'egg';

module.exports = (options, app: Application) => {
    return async function dAes(ctx: Context, next) {
        console.log(options);
        console.log(app);
        console.log(ctx);
<<<<<<< HEAD
        if (ctx.method === 'GET' && ctx.query.cry) {
            ctx.query = cry_daes(ctx.query.cry);
        } else if (ctx.method === 'POST' && ctx.request.body.cry) {
            ctx.request.body = cry_daes(ctx.request.body.cry);
=======
        if (ctx.method === 'GET') {
            ctx.query = cry_daes(ctx.query.cry);
        } else {
            cry_daes(ctx.request.body.cry);
>>>>>>> 266544951096e6ac92b621a1e431798c2fe0a7eb
        }

        await next();
    };
};
