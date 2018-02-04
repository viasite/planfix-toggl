const nodemailer = require('nodemailer');
const TogglClient = require('toggl-api');
const settings = require('electron-settings');
var toggl;

// валидации всех настроек здесь нет, считается, что их уже проверили
prefs = settings.getAll();

// получает записи из Toggl и отправляет в Планфикс
var sendToPlanfix = function(){
    toggl = new TogglClient({ apiToken: prefs.apiToken });
    var me;

    toggl.getUserData({}, function (err, userData) {
        if (err !== null) {
            return console.log(err);
        }
        me = userData;

        toggl.detailedReport({
            userAgent: prefs.userAgent,
            workspace_id: prefs.workspaceId,
            per_page: 500
        }, function (err, report) {
            if (err !== null) {
                console.log(err);
                return;
            }

            console.log('report loaded');

            report.data.forEach(function (entry) {
                isSent = false;
                planfixTaskId = 0;
                isMe = entry.uid == me.id;
                if (!isMe) {
                    return;
                }
                entry.tags.forEach(function (tag) {
                    if (tag.match(/^\d+$/)) {
                        planfixTaskId = parseInt(tag);
                    }
                    if (tag == prefs.sentTag) {
                        isSent = true;
                    }
                });
                if (planfixTaskId > 0 && !isSent) {
                    sendEntry(planfixTaskId, entry);
                }
            });

            console.log('no more entries for sync');
        });
    });
};

// отправка письма и пометка тегом sent в Toggl
var sendEntry = function (planfixTaskId, entry) {
    var mins = parseInt(entry.dur / 1000 / 60);

    let transporter = nodemailer.createTransport({
        host: prefs.smtpHost,
        port: prefs.smtpPort,
        secure: prefs.smtpSecure=='true' || prefs.smtpSecure == '1',
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

module.exports.sendToPlanfix = sendToPlanfix;