const createRuleAppName = {
    appName: 'string',
};

const createRuleAppNameBundleId = {
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
    index: 'string',
    size: 'string',
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
    deviceName : 'string',
    ispName : 'string',
    model : 'string',
    noncestr : 'int',
    osVersion : 'string',
    provisionName : 'string',
    version : 'string',
    certCompany: 'string',
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

const createRuleUserAccount = {
    userAccount : 'string',
};

const createRuleProvisionName = {
    provisionName : 'string',
};

const createRuleProvisionUdid = {
    certUdid : 'string',
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
        createRuleUserAccount,
        createRuleAppNameBundleId,
        createRuleProvisionUdid,
     };
