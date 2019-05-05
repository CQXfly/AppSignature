const createRuleAppName = {
    appName: 'string',
    bundleid: 'string',
};

const createRuleShowMessage = {
    showMsg: 'string',
    showUrl: 'string',
    forceEnable: 'bool',
};

const createRuleValidDay = {
    validDay: 'int',
};

const createRuleMaxSupportDevice = {
    maxInstallNum: 'int',
};

const createRulePage = {
    index: 'int',
    size: 'int',
};

const createRuleCertName = {
    provisionName: 'string',
};

const createRuleAppStatus = {
    appName: 'string',
    bundleid: 'string',
};

const createRuleUploadAppDevice = {
    appName : 'string',
    bundleVersion : 'string',
    bundleid : 'string',
    devUdid : 'string',
    deviceIp : 'string',
    deviceMAC : 'string',
    deviceName : 'string',
    ispName : 'string',
    model : 'string',
    noncestr : 'int',
    osVersion : 'string',
    platform : 'int',
    provisionName : 'string',
    version : 'string',
};

const createRuleBindToApp = {
    appName : 'string',
    bundleid: 'string',
    userAccount: 'string',
    email: 'string',
};

const createRuleUserId = {
    userid : 'string',
};

const createRuleProvisionName = {
    provisionName : 'string',
};

const createRuleUploadAppInfo = {
    appName: 'string',
    bundleid: 'string',
    bundleVersion: 'string',
    certUdid: 'string',
    cerName: 'string',
    provisionName: 'string',
    expirationDate: 'date',
    provisionType: 'int',
};

export { createRuleAppName,
        createRuleShowMessage,
        createRuleValidDay,
        createRuleMaxSupportDevice,
        createRuleCertName,
        createRuleAppStatus,
        createRuleUploadAppDevice,
        createRuleBindToApp,
        createRuleUserId,
        createRuleProvisionName,
        createRuleUploadAppInfo,
        createRulePage,
     };
