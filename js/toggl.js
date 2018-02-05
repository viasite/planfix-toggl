const {promisify} = require('util');
const nodemailer = require('nodemailer');
const TogglClient = require('toggl-api');
const settings = require('./settings');

// валидации всех настроек здесь нет, считается, что их уже проверили
let prefs;
let toggl;
let pendingEntries;

// получает записи из Toggl и отправляет в Планфикс
async function sendToPlanfix(){
    let entries = await getPendingEntries();
    console.log('report loaded');
    entries.forEach(function(entry){
        sendEntry(entry.planfix_task_id, entry);
        console.log('send', entry);
    });
    delete pendingEntries;
};

async function getPendingEntries(force){
    if(!pendingEntries || force){
        pendingEntries = await getPendingEntriesAsync();
    }
    return pendingEntries;
};

function getPendingEntriesAsync(){
    let entries = [];
    prefs = settings.getAll();
    toggl = new TogglClient({ apiToken: prefs.apiToken });

    return new Promise(function(resolve, reject){
        /* const togglGetUserDataAsync = promisify(toggl.getUserData);
        togglGetUserDataAsync({})
            .then(function(me){
                resolve(me);
            })
            .catch(function(err){
                reject(err)
            ); */

        toggl.getUserData({}, function (err, me) {
            if (err !== null) {
                reject(err);
            }

            toggl.detailedReport({
                userAgent: prefs.userAgent,
                workspace_id: prefs.workspaceId,
                per_page: 500
            }, function (err, report) {
                if (err !== null) {
                    reject(err);
                    return;
                }

                report.data.forEach(function (entry) {
                    let isSent = false;
                    let planfixTaskId = 0;
                    let isMe = entry.uid == me.id;
                    if (!isMe) {
                        return;
                    }
                    entry.tags.forEach(function (tag) {
                        if (tag.match(/^\d+$/)) {
                            planfixTaskId = parseInt(tag);
                        }
                        if (tag === prefs.sentTag) {
                            isSent = true;
                        }
                    });
                    if (planfixTaskId > 0 && !isSent) {
                        entry.planfix_task_id = planfixTaskId;
                        entries.push(entry);
                    }
                });

                resolve(entries);
            });
        });
    });
};

// отправка письма и пометка тегом sent в Toggl
function sendEntry(planfixTaskId, entry) {
    let mins = parseInt(entry.dur / 1000 / 60);

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

    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            return console.log(err);
        }
        console.log('entry [' + entry.project + '] "' + entry.description + '" (' + mins + ') sent to Planfix');

        toggl.updateTimeEntriesTags([entry.id], [prefs.sentTag], 'add', function (err, timeEntries) {
            if (err !== null) {
                return console.log(err);
            }
            console.log('entry ' + entry.id + ' marked as sent');
        });
    });
};

module.exports.getPendingEntries = getPendingEntries;
module.exports.sendToPlanfix = sendToPlanfix;