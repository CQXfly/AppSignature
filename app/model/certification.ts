import { Application } from 'egg';
import BaseModel from '../model';

export default function Certification(app: Application) {
    const { STRING, DATE, INTEGER, BOOLEAN } = app.Sequelize;
    const schema = BaseModel(app, 'certification', {
        cert_udid: {
            type: STRING,
            unique: true,
        },
        cert_name: {
            type: STRING,
        },
        provision_name: {
            type: STRING,
            unique: true,
        },
        description: {
            type: STRING,
        },
        price: {
            type: INTEGER,
        },
        provision_type: {
            type: INTEGER,
        },
        expiration_data: {
            type: DATE,
        },
        enable: {
            type: BOOLEAN,
        },
        deleted_at: DATE, // 软删除时间
        created_at: DATE, // 创建时间
        updated_at: DATE, // 更新时间
    });
    return schema;
}
