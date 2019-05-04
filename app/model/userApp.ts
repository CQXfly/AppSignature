import { Application } from 'egg';
import BaseModel from '../model';

export default function UserApp(app: Application) {
    const { DATE, INTEGER } = app.Sequelize;
    const schema = BaseModel(app, 'user_app', {
        user_id: {
            type: INTEGER,
            allowNull: false,
        },
        app_id: {
            type: INTEGER,
            allowNull: false,
        },
        deleted_at: DATE, // 软删除时间
        created_at: DATE, // 创建时间
        updated_at: DATE, // 更新时间
    });
    return schema;
}
