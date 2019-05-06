import { Context } from 'egg';
import Result from '../helper/result';

module.exports = () => {
    return async function errorHandler(ctx: Context, next) {
        try {
            await next();
        } catch (err) {
            ctx.app.emit('error', err, ctx);
            const status = err.status || 500;
            const error = status === 500 && ctx.app.config.env === 'prod'
            ? 'Internal Server Error' : err.message;
            ctx.body = { error };
            if (status === 422) {
                // err.errors
                ctx.body = Result.error(402, '参数错误');
              }
            ctx.status = status;
        }
    };
};
