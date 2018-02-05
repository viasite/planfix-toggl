const toggl = require('./toggl');
const settings = require('./settings');

if(!settings.isSettingsFilled()){
    throw new Error('Fill all settings: ' + settings.getUnfilled().join(', '));
}

toggl.sendToPlanfix();
