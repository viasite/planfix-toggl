const express = require('express');
const settings = require('./settings');
const toggl = require('./toggl');
const app = express();

app.get('/', async function(req, res, next) {
  res.redirect('http://localhost:3001/');
});

app.get('/api/v1/toggl/entries', async function(req, res, next) {
  let entries;
  if(req.query.type == 'today'){
    let date = new Date();
    date.setDate(date.getDate() - 0);
    entries = toggl.groupEntriesByTask(await toggl.getEntries({
      since: date.toISOString()
    }));
  } else if(req.query.type == 'pending'){
    entries = toggl.groupEntriesByTask(await toggl.getPendingEntries());
  } else if(req.query.type == 'last'){
    entries = toggl.groupEntriesByTask(await toggl.getEntries({}));
  }
  res.send(entries);
});

app.get('/send', async function(req, res, next) {
  const entriesSent = await toggl.sendToPlanfix();
  res.send(entriesSent);
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
