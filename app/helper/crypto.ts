
import * as crypto from 'crypto';
const secrect = 'abcdabcdabcdabcd';
const iv = '1012132405963708';
function cry_md5(src: string): string {
    const r = crypto.createHash('md5');
    r.update(src);
    return r.digest('hex');
}

function cry_aes(src: string): string {
    const r = crypto.createCipheriv('aes-128-cbc', secrect, iv);
    r.setAutoPadding(true);
    let enc = r.update(src, 'utf8', 'hex');
    enc += r.final('hex');
    return enc;
}

function cry_daes(src: any): any {
    const r = crypto.createDecipheriv('aes-128-cbc', secrect, iv);
    r.setAutoPadding();
    let decode = r.update(src, 'hex', 'utf8');
    decode += r.final('utf8');
    console.log(decode);
    // pading的问题
    try {
        return JSON.parse(decode);
    } catch (error) {
        const message: string = error.message;
        let i = 0;
        const t = 'Unexpected token  in JSON at position ';
        // if (message.includes(t)) {
        const r = message.substr(t.length, message.length - t.length);
        i = Number(r);
        // }
        return JSON.parse(decode.substring(i, 0));
    }
}

export { cry_md5, cry_aes, cry_daes };
