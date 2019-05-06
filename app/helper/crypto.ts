
import * as crypto from 'crypto';
import { json } from 'body-parser';
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
    decode += r.final('hex');
    return JSON.parse(decode);
}

export { cry_md5, cry_aes, cry_daes };
