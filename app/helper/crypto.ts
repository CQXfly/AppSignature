
import * as crypto from 'crypto';
export default function cry_md5(src: string): string {
    const r = crypto.createHash('md5');
    r.update(src);
    return r.digest('hex');
}
