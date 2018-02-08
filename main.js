require('./js/express-start');
const toggl = require('./js/toggl');
const settings = require('./js/settings');
let sendIntervalTime = settings.get('sendInterval', 0);
if(sendIntervalTime > 0){
  console.log('send interval: ' + sendIntervalTime);
  toggl.sendToPlanfix().catch(err => console.error(err));
  setInterval(function(){
      console.log('send interval');
      toggl.sendToPlanfix().catch(err => console.error(err))
  }, sendIntervalTime * 60000);
}
