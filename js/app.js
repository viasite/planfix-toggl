const express = require('express');
const path = require('path');
const twig = require('twig');
const settings = require('./settings');
const toggl = require('./toggl');
const app = express();

app.get('/', async function(req, res, next) {
  const entries_pending = toggl.groupEntriesByTask(await toggl.getPendingEntries());

  let date = new Date();
  //date.setDate(date.getDate() - 1);
  const entries_today = toggl.groupEntriesByTask(await toggl.getEntries({
    since: date.toISOString()
  }));

  res.render('pages/index.twig', {
    entries_pending: entries_pending,
    entries_today: entries_today,
    title: 'planfix-toggl',
    header: 'Ожидают отправки',
    planfix_account: settings.get('planfixAccount')
  });
});

app.get('/send', async function(req, res, next) {
  const entriesSent = await toggl.sendToPlanfix();
  res.render('pages/send.twig', {
    entries: entriesSent,
    title: 'send - planfix-toggl',
    header: 'Отправлено',
    planfix_account: settings.get('planfixAccount')
  });
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
