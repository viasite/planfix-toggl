const nodemailer = require('nodemailer');
const TogglClient = require('toggl-api');
const settings = require('./settings');

// данные не меняются при этой опции
const testMode = false;

// валидации всех настроек здесь нет, считается, что их уже проверили
let user;
const prefs = settings.getAll();
const toggl = new TogglClient({ apiToken: prefs.apiToken });

// получает записи из Toggl и отправляет в Планфикс
async function sendToPlanfix(){
    let pendingEntries = await getPendingEntries();
    let entries = groupEntriesByTask(pendingEntries);
    entries.forEach(entry => (async (entry) => {
        let entryString = entry.description + ' (' + Math.round(entry.dur / 60000) + ')';
        try{
            await sendEntry(entry.planfix.task_id, entry);
            console.log('entry ' + entryString + ' sent to #' + entry.planfix.task_id);
        } catch (err){
            console.log('entry ' + entryString + ' failed');
        }
    })(entry));
    return entries;
}

function groupEntriesByTask(entries){
    let grouped = {};
    entries.forEach(entry => {
        if(grouped.hasOwnProperty(entry.planfix_task_id)){
            grouped[entry.planfix_task_id].dur += entry.dur;
        } else {
            grouped[entry.planfix_task_id] = entry;
        }
    });
    return Object.values(grouped);
}

function getUserData(){
    return new Promise((resolve, reject) => {
        if(user){
            resolve(user);
            return;
        }
        toggl.getUserData({}, function (err, me) {
            if (err) {
                reject(err);
                return;
            }
            user = me;
            resolve(me);
        });
    });
}

// native toggl report
function getReport(opts){
    return new Promise((resolve, reject) => {
        if(!opts.workspace_id){
            opts.workspace_id = prefs.workspaceId;
        }
        toggl.detailedReport(opts, function (err, report) {
            if (err) {
                reject(err);
                return;
            }
            resolve(report);
        });
    });
}

// report entries with planfix data
async function getEntries(opts){
    let report = await getReport(opts);
    return report.data.map(entry => {
        entry.planfix = {
            sent: false,
            task_id: 0
        }

        entry.tags.forEach(tag => {
            // only digit == planfix_task_id
            if (tag.match(/^\d+$/)) {
                entry.planfix.task_id = parseInt(tag);
            }
            // sent tag
            if (tag === prefs.sentTag) {
                entry.planfix.sent = true;
            }
        });

        return entry;
    });
}

async function getPendingEntries(){
    let user = await getUserData();
    let entries = await getEntries({});
    return entries
        .filter(entry => entry.planfix.task_id != 0)
        .filter(entry => !entry.planfix.sent)
        .filter(entry => entry.uid == user.id)
}

// отправка письма и пометка тегом sent в Toggl
function sendEntry(planfixTaskId, entry) {
    return new Promise(function(resolve, reject){
        let mins = Math.round(entry.dur / 1000 / 60);

        let transporter = nodemailer.createTransport({
            host: prefs.smtpHost,
            port: prefs.smtpPort,
            secure: prefs.smtpSecure,
            auth: {
                user: prefs.smtpLogin,
                pass: prefs.smtpPassword
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: prefs.emailFrom,
            to: 'task+' + planfixTaskId + '@' + prefs.planfixAccount + '.planfix.ru',
            subject: '@toggl @nonotify',
            text:
                'Вид работы: ' + prefs.planfixAnaliticName + '\n' +
                'time:' + mins + '\n' +
                'Автор: ' + prefs.planfixAuthorName + '\n' +
                'Дата: ' + entry.start.substring(0, 10)
        };

        if(testMode){
            resolve(entry);
            return;
        }

        transporter.sendMail(mailOptions, function(err, info){
            if (err) {
                reject(err);
                return;
            }
            console.log('entry [' + entry.project + '] "' + entry.description + '" (' + mins + ') sent to Planfix');

            toggl.updateTimeEntriesTags([entry.id], [prefs.sentTag], 'add', function (err, timeEntries) {
                if (err !== null) {
                    reject(err);
                    return;
                }
                resolve(entry);
            });
        });
    });
}

module.exports.getEntries = getEntries;
module.exports.getPendingEntries = getPendingEntries;
module.exports.groupEntriesByTask = groupEntriesByTask;
module.exports.sendToPlanfix = sendToPlanfix;