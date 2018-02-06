var express = require('express');
var path = require('path');
var twig = require('twig');
var settings = require('./settings');
var toggl = require('./toggl');
var app = express();

app.get('/', async function(req, res, next) {
  // res.render('index', { title: 'planfix-toggl', entries: entries });
  var entries = await toggl.getPendingEntries(true);
  var out = entries.map(entry => '[' + entry.project + '] ' + entry.description + ' (' + parseInt(entry.dur/60000) + ')');
  res.render('index.twig', {
    entries: entries,
    title: 'planfix-toggl',
    header: 'Ожидают отправки',
    planfix_account: settings.get('planfixAccount')
  });
});

app.get('/send', async function(req, res, next) {
  var entries = await toggl.getPendingEntries();
  if(entries.length == 0){
    res.send('<title>send - planfix-toggl</title>Нечего отправлять');
  }
  var entriesSent = await toggl.sendToPlanfix();
  var out = entriesSent.map(entry => entry.description);
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
