require('./js/express-start');
let toggl = require('./js/toggl');
toggl.sendToPlanfix().catch(err => console.error(err));
setInterval(function(){
    toggl.sendToPlanfix().catch(err => console.error(err))
}, 300000);