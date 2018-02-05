require('./js/express-start');
let toggl = require('./js/toggl');
toggl.sendToPlanfix();
setInterval(toggl.sendToPlanfix, 300000);