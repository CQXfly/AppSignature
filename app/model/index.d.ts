import { Model, SequelizeStatic, Sequelize } from 'sequelize';
import Test from './test';
import Appmodel from './appmodel';
import Certification from './certification';
import Devicemodel from './devicemodel';
import Signtype from './signtype';
import Usermodel from './usermodel';



declare module 'egg' {
    interface Application {
      Sequelize: SequelizeStatic
      model: Sequelize
    }
  
    interface Context {
      model: {
        Test: Model<Test,{}>
        Appmodel: Model<Appmodel,{}>;
        Certification: Model<Certification,{}>;
        Devicemodel: Model<Devicemodel,{}>;
        Signtype: Model<Signtype,{}>;
        Usermodel: Model<Usermodel,{}>;
      }
    }
  }

declare module 'sequelize' {
    interface Model<TInstance, TAttributes> {
      fillable(): string[];
      hidden(): string[];
      visible(): string[];
      getAttributes(): string[];
      findAttribute(attribute: string): object | undefined;
  
      getDataValue(key: string): any;
  
      setDataValue(key: string, value: any): void;
    }
  }