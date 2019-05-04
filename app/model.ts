import { Application } from 'egg';
import { snakeCase } from 'lodash';
import * as moment from 'moment';
import { DefineAttributes, SequelizeStatic } from 'sequelize';

export default function BaseModel(
    app: Application,
    table: string,
    attributes: DefineAttributes,
    options: object = {},
) {
    const { Op , INTEGER } = app.Sequelize;
    const modelSchema = app.model.define(table, {
        id: {
            type: INTEGER,
            unique: true,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        ...attributes,
        ...getDefaultAttributes(options, app.Sequelize),
    }, {
        timestamps: true, // 自动维护时间戳 [ created_at、updated_at ]
        underscored: true, // 不使用驼峰样式自动添加属性，而是下划线样式 [ createdAt => created_at ]
        // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
        // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
        freezeTableName: false,
        ...options,
        scopes: {
            // 定义全局作用域，使用方法如: .scope('onlyTrashed') or .scope('onlyTrashed1', 'onlyTrashed12') [ 多个作用域 ]
            onlyTrashed: {
            // 只查询软删除数据
                where: {
                    deleted_at: {
                        [Op.not]: null,
                    },
                },
            },
        },
    });

    modelSchema.getAttributes = (): string[] => {
        return Object.keys(attributes);
    };
    modelSchema.findAttribute = (attribute: string): object | undefined => {
        return (attributes as any)[attribute];
    };

    modelSchema.fillable = (): string[] => {
        return [];
    };

    modelSchema.hidden = (): string[] => {
        return [];
    };

    modelSchema.visible = (): string[] => {
        return [];
    };
    return modelSchema;
}

function getDefaultAttributes(options: object, sequelize: SequelizeStatic): object {
    const { DATE } = sequelize;

    const defaultAttributes = {
        created_at: {
            type: DATE,
            get() {
                return moment((this as any).getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        updated_at: {
            type: DATE,
            get() {
                return moment((this as any).getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
            },
        },
    };

    const attributes = [ 'createdAt', 'updatedAt', 'deletedAt' ];

    Object.keys(options).forEach((value: string) => {
      if (attributes.includes(value) && (options as any)[value] === false) {
        delete (defaultAttributes as any)[snakeCase(value)];
      }
    });

    return defaultAttributes || {};
}
