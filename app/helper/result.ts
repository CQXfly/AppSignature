import { cry_aes } from './crypto';

export default class Result {
    code: number;
    data: object | null;
    message: string;

    static error(code: number, msg: string): Result {
        const e = new Result();
        e.code = code;
        e.message = msg;
        return e;
    }

    static default(code: number = 200, msg: string = '更新成功'): Result {
        const e = new Result();
        e.code = code;
        e.message = msg;
        return e;
    }

    static paramError(param: string): Result {
        return Result.error(400, `缺省参数${param}`);
    }

    static ServerError(): Result {
        const e = Result.error(500, '服务器错误');
        return e;
    }

    static Sucess(data: object | null, cry: boolean = false, code: number = 200, message: string = 'success'): Result {
        if (data === null) {
            return Result.error(204, '无数据');
        }

        const r = new Result();
        r.code = code;
        r.message = message;
        r.data = {
            cry,
            result: cry ? cry_aes(JSON.stringify(data)) : data,
        };
        return r;
    }

}
