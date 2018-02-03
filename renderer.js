var yaml = require('node-yaml');
var nodemailer = require('nodemailer');
var TogglClient = require('toggl-api');

var settings = {};
var toggl;

yaml.read('config.default.yml', function (err, settingsDefault) {
    if (err != null) {
        return console.log(err);
    }
    yaml.read('config.yml', function (err, settingsCustom) {
        if (err != null) {
            return console.log(err);
        }
        settings = Object.assign({}, settingsDefault, settingsCustom);

        toggl = new TogglClient({ apiToken: settings.apiToken });
        var me;

        console.log('config loaded');

        toggl.getUserData({}, function (err, userData) {
            if (err !== null) {
                return console.log(err);
            }
            me = userData;

            toggl.detailedReport({
                userAgent: settings.userAgent,
                workspace_id: settings.workspaceId,
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
                        if (tag == settings.sentTag) {
                            isSent = true;
                        }
                    });
                    if (planfixTaskId > 0 && !isSent) {
                        sendEntry(planfixTaskId, entry);
                    }
                });
            });
        });
    });
});

var sendEntry = function (planfixTaskId, entry) {
    var mins = parseInt(entry.dur / 1000 / 60);

    let transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpSecure,
        auth: {
            user: settings.smtpLogin,
            pass: settings.smtpPassword
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: settings.emailFrom,
        to: 'task+' + planfixTaskId + '@' + settings.planfixAccount + '.planfix.ru',
        subject: '@toggl @nonotify',
        text:
            'Вид работы: ' + settings.planfixAnaliticName + '\n' +
            'time:' + mins + '\n' +
            'Автор: ' + settings.planfixAuthorName + '\n' +
            'Дата: ' + entry.start.substring(0, 10)
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            return console.log(err);
        }
        console.log('entry [' + entry.project + '] "' + entry.description + '" (' + mins + ') sent to Planfix');

        toggl.updateTimeEntriesTags([entry.id], [settings.sentTag], 'add', function (err, timeEntries) {
            if (err !== null) {
                return console.log(err);
            }
            console.log('entry ' + entry.id + ' marked as sent');
        });
    });
}
