var express = require('express');
var path = require('path');
var settings = require('./settings');
var toggl = require('./toggl');

var app = express();

app.get('/', async function(req, res, next) {
  // res.render('index', { title: 'planfix-toggl', entries: entries });
  var entries = await toggl.getPendingEntries(true);
  var out = entries.map(entry => '[' + entry.project + '] ' + entry.description + '(' + parseInt(entry.dur/60000) + ')');
  res.send('<title>planfix-toggl</title>Ожидают отправки:<br>' + out.join('<br>'));
});

app.get('/send', async function(req, res, next) {
  var entries = await toggl.getPendingEntries();
  toggl.sendToPlanfix();
  var out = entries.map(entry => entry.descrciption);
  res.send('<title>planfix-toggl</title>Отправлены:<br>' + out.join('<br>'));
});

app.get('/settings', function(req, res, next) {
  res.send(settings.getAll());
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;
