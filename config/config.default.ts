import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1556411188097_9272';

  // add your egg config in here
  config.middleware = [ 'errorHandler' ];

  config.errorHandler = {
    match: '/',
  },

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    sequelize: {
      dialect: 'postgres',
      database: 'AppSignature',
      host: '127.0.0.1',
      port: '5432',
      username: 'vapor',
      password: 'q123456',
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
