const settings = require('electron-settings');

var opts = [
    'userAgent',
    'sentTag',
    'smtpHost',
    'smtpPort',
    'smtpSecure',
    'planfixAccount',
    'planfixAnaliticName',

    'apiToken',
    'workspaceId',
    'smtpLogin',
    'smtpPassword',
    'emailFrom',
    'planfixAuthorName',
];

var defaults = {
    userAgent: 'planfix-toggl',
    sentTag: 'sent',
    smtpHost: 'smtp.yandex.ru',
    smtpPort: '587',
    smtpSecure: 'false',
    planfixAccount: 'tagilcity',
    planfixAnaliticName: 'Поминутная работа программиста'
};

var isSettingsFilled = function(){
    var isFill = true;
    opts.forEach(function(name){
        var val = settings.get(name);
        if(val === undefined){
            isFill = false;
        }
    });
    return isFill;
};

module.exports.opts = opts;
module.exports.defaults = defaults;
module.exports.isSettingsFilled = isSettingsFilled;