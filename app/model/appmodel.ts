import { Application } from 'egg';
import BaseModel from '../model';

export default function App(app: Application) {
    const { STRING, INTEGER, DATE, BOOLEAN, ARRAY, JSON, BIGINT } = app.Sequelize;
    const schema = BaseModel(app, 'app', {
        app_card_id: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        provision_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_open: {
            type: BOOLEAN,
            defaultValue: false,
        },
        userid: {
            type: INTEGER,
        },
        sign_type: {
            type: INTEGER,
        },
        sign_price: {
            type: INTEGER,
            comment: '签名价格',
        },
        app_name: {
            type: STRING,
        },
        bundleid: {
            type: STRING,
        },
        bundle_version: {
            type: STRING,
        },
        cert_company: {
            type: STRING,
        },
        provision_name: {
            type: STRING,
        },
        valid_day: {
            type: INTEGER,
        },
        mark_message: {
            type: STRING,
        },
        start_time: {
            type: BIGINT,
        },
        end_time: {
            type: BIGINT,
        },
        update_logs: {
            type: ARRAY(JSON),
        },
        show_msg: {
            type: STRING,
        },
        show_url: {
            type: STRING,
        },
        max_install_num: {
            type: INTEGER,
            defaultValue: 200,
        },
        current_device_num: {
            type: INTEGER,
        },
        user_contact: {
            type: STRING,
        },
        is_force: {
            type: BOOLEAN,
            defaultValue: false,
        },
        deleted_at: DATE, // 软删除时间
        created_at: DATE, // 创建时间
        updated_at: DATE, // 更新时间
    });
    return schema;
}
