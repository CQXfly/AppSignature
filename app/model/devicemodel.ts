import { Application } from 'egg';
import BaseModel from '../model';

export default function Device(app: Application) {
    const { INTEGER, STRING, DATE, BIGINT, BOOLEAN } = app.Sequelize;
    const schema = BaseModel(app, 'device', {
        appid: {
            type: INTEGER,
        },
        app_name: {
            type: STRING,
        },
        dev_udid: {
            type: STRING,
        },
        isp_name: {
            type: STRING,
        },
        device_mac: {
            type: STRING,
        },
        device_name: {
            type: STRING,
        },
        noncestr: {
            type: BIGINT,
        },
        model: {
            type: STRING,
        },
        lastnoncestr: {
            type: BIGINT,
        },
        platform: {
            type: INTEGER,
        },
        os_version: {
            type: STRING,
        },
        deviceip: {
            type: STRING,
        },
        provision_name: {
            type: STRING,
        },
        cert_company: {
            type: STRING,
        },
        version: {
            type: STRING,
        },
        forbidden: {
            type: BOOLEAN,
            defaultValue: false,
        },
        deleted_at: DATE, // 软删除时间
        created_at: DATE, // 创建时间
        updated_at: DATE, // 更新时间
    });
    return schema;
}
