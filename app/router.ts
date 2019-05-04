import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  app.model.Test.sync({ alter: true });
  app.model.Appmodel.sync({ alter: true });
  app.model.Certification.sync({ alter: true });
  app.model.Usermodel.sync({ alter: true });
  app.model.Signtype.sync({ alter: true });
  app.model.Devicemodel.sync({ alter: true });
  app.logger.info('test');

  router.get('/app', controller.app.index);

  router.post('/app', controller.app.index);
  // 注册/更新App接口(证书信息也可以在这里创建)
  router.post('/app/updateAppInfo', controller.app.updateAppInfo);
  // 查询APP是否注册，是否到期，并返回服务器存储的签名所使用的证书名字、公司名字、用户名
  router.get('/app/appStatus', controller.app.findAppStatus);

  // APP列表、并且能根据到期时间、最大用户量等进行排序 /分页返回
  router.get('/app/applist', controller.app.getAppList);
  // 删除App
  router.delete('/app/delete', controller.app.delete);
  // 搜索APP
  router.get('/app/search', controller.app.search);

  router.post('/app/changeShowMsg', controller.app.updateShowMessage);

  router.post('/app/changeValidDay', controller.app.updateValidDay);

  router.post('/app/changeMaxSupportDevice', controller.app.updateMaxSupportDevice);

  // 查询证书列表及其下的所有设备总量/月/日活
  router.get('/cer/cerList', controller.cer.getCertList);

  // 查询某个证书下的所有APP
  router.get('/cer/appList', controller.cer.applist);

  // 每个APP日新增、月活
  router.get('/app/dayGrowth', controller.app.dayGrowth);
  router.get('/app/monthActive', controller.app.appMonthActive);
  // 今日、这周活跃设备数量
  router.get('/device/dayActive', controller.device.DayActive);
  router.get('/device/weekActive', controller.device.WeekActive);
  // 获取用户列表
  router.get('/user/userList', controller.user.getUserList);

  router.post('/app/register', controller.app.registerApp);

  // 上传APP信息，获取APP是否可以打开、打开显示信息、是否必须点击
  router.post('/app/appStatus', controller.app.uploadAppStatus);
  // 上传设备、APP、证书信息后台用于收集信息，设备匹配查询是否已再数据库中
  router.post('/device/uploadAppDevInfo', controller.device.uploadAppDeviceInfo);

  // 绑定APP到用户（用户没有注册接口，当App需要绑定到qq的时候，此用户也没有注册，则为其注册一个用户）
  router.post('/user/bindApp', controller.user.bindToApp);
  // 查询用户下面的App
  router.get('/user/appList', controller.user.getAppListByUser);
};
