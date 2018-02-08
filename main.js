require('./js/express-start');
const toggl = require('./js/toggl');
const settings = require('./js/settings');
let sendIntervalTime = settings.get('sendInterval', 0);
if(sendIntervalTime > 0){
  console.log(new Date().toISOString() + ' - send interval: ' + sendIntervalTime);
  toggl.sendToPlanfix().catch(err => console.error(err));
  setInterval(function(){
      console.log(new Date().toISOString() + ' - send interval');
      toggl.sendToPlanfix().catch(err => console.error(err))
  }, sendIntervalTime * 60000);
}
