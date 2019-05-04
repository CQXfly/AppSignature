import { Application } from 'egg';
import BaseModel from '../model';

export default function User(app: Application) {
    const { STRING, INTEGER, DATE } = app.Sequelize;
    const schema = BaseModel(app, 'user', {
        userAccount: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        balance: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        email: {
            type: STRING,
        },
        deleted_at: DATE, // 软删除时间
        created_at: DATE, // 创建时间
        updated_at: DATE, // 更新时间
    });
    return schema;
}
