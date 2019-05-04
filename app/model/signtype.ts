import { Application } from 'egg';
import BaseModel from '../model';

export default function SignType(app: Application) {
    const { STRING, DATE, INTEGER } = app.Sequelize;
    const schema = BaseModel(app, 'signtype', {
        name: {
            type: STRING,
        },
        certs: {
            type: INTEGER,
        },
        deleted_at: DATE, // 软删除时间
        created_at: DATE, // 创建时间
        updated_at: DATE, // 更新时间
    });
    return schema;
}
