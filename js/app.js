const express = require('express');
const settings = require('./settings');
const toggl = require('./toggl');
const app = express();
const bodyParser = require('body-parser');
const xml = require('xml');
require('body-parser-xml')(bodyParser);
app.use(bodyParser.xml())

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

app.post('/planfix', async function(req, res, next) {
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    raw_body = Buffer.concat(body).toString();
    console.log(raw_body)
  });

  console.log(req.body)
  res.set('Content-Type', 'text/xml');
  if(req.body){
    let method = req.body.request.$.method;
    if(method){
      console.log('response on ' + method)
    }
    if(method == 'auth.login'){
      let r = xml({
        response: [
          {
            _attr: { status: 'ok' }
          },
          { sid: 123 }
        ]
      });
      console.log(r);
      res.send(r);
    } else if (method == 'action.getList'){
      res.send('<?xml version="1.0" encoding="UTF-8"?>\n<response status="ok"><actions totalCount="31" count="31"><action><id>6378998</id><description>{event21}</description><type>TASKOVERDUED</type><isNotRead>1</isNotRead><dateTime>16-02-2018 23:55</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6367906</id><description>{event23}&lt;br/&gt;{event24}: 16-02-2018, {event25}: &lt;b&gt;3&lt;/b&gt; {event26}</description><type>TASKCLOSETODEADLINE</type><isNotRead>0</isNotRead><dateTime>13-02-2018 20:26</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6364522</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>13-02-2018 01:27</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>611423</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6364468</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>13-02-2018 00:30</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>611422</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6360500</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>11-02-2018 17:30</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>611234</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6352510</id><description>{log26}</description><type>TASKCHANGED</type><isNotRead>0</isNotRead><dateTime>08-02-2018 15:48</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><taskExpectDateChanged><oldDate>07-02-2018 23:59</oldDate><newDate>16-02-2018 23:59</newDate><newDateIsSet>1</newDateIsSet><oldDateIsSet>1</oldDateIsSet></taskExpectDateChanged><notifiedList/></action><action><id>6349324</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>08-02-2018 02:06</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610822</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6349288</id><description>{event21}</description><type>TASKOVERDUED</type><isNotRead>0</isNotRead><dateTime>07-02-2018 23:55</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6345466</id><description>{event23}&lt;br/&gt;{event24}: 07-02-2018, {event25}: &lt;b&gt;1&lt;/b&gt; {event26}</description><type>TASKCLOSETODEADLINE</type><isNotRead>0</isNotRead><dateTime>07-02-2018 02:26</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6341024</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>06-02-2018 08:04</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610449</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6341022</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>06-02-2018 08:04</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610448</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6340960</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>06-02-2018 00:54</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610447</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336724</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>04-02-2018 06:32</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610249</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336722</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>04-02-2018 06:32</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610248</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336720</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>04-02-2018 06:32</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610247</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336716</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>04-02-2018 00:44</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610245</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336710</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>04-02-2018 00:44</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610242</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336672</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:59</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610238</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336654</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:52</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610236</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336652</id><description>time:41&lt;br/&gt;</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:50</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610235</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336650</id><description>{log26}&lt;br&gt;[&lt;i&gt;{log29}&lt;/i&gt;]:&amp;nbsp;Интеграция с toggl&lt;br/&gt;&lt;div class=\'log-expand\' onclick=\'log_toggleExtra(this); return false;\' title=\'{log27}\'&gt;&lt;/div&gt;&lt;span class=\'fakelink-dashed\' onclick=\'log_toggleExtra($(this).prev()); return false;\'&gt;{event1}&lt;/span&gt; &lt;span class=\'log-extra\' style=\'display:none;\'&gt;&lt;br&gt;[&lt;i&gt;{log28}&lt;/i&gt;]:&amp;nbsp;Интеграция с zapier&lt;/span&gt;</description><type>TASKCHANGED</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:09</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336648</id><description>time:12&lt;br/&gt;</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:09</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610234</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336646</id><description>time:1&lt;br/&gt;</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:08</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610233</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336644</id><description>time:72&lt;br/&gt;</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 21:08</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>610232</key><name>Выработка</name></analitic></analitics><notifiedList/></action><action><id>6336642</id><description>time:1</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 20:54</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336640</id><description>time:72</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 20:54</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336638</id><description>time:12</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 20:54</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336636</id><description>time:0</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 20:54</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336634</id><description>time:46</description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>03-02-2018 20:54</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336628</id><description>{event6}: &lt;a href=\'/?action=user&amp;id=8152\' &gt;Станислав Попов&lt;/a&gt;&lt;br&gt;{event8}: 03.02.2018 &amp;mdash; 07.02.2018</description><type>WORKEREMPLOYED</type><isNotRead>0</isNotRead><dateTime>03-02-2018 17:09</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><notifiedList/></action><action><id>6336626</id><description></description><type>TASKCREATED</type><isNotRead>0</isNotRead><dateTime>03-02-2018 17:09</dateTime><fromEmail>0</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><taskExpectDateChanged><oldDate>07-02-2018 23:59</oldDate><newDate>07-02-2018 23:59</newDate><newDateIsSet>1</newDateIsSet><oldDateIsSet>1</oldDateIsSet></taskExpectDateChanged><taskStartTimeChanged><oldDate>03-02-2018 00:00</oldDate><newDate>03-02-2018 00:00</newDate><newDateIsSet>1</newDateIsSet><oldDateIsSet>1</oldDateIsSet></taskStartTimeChanged><notifiedList><user><id>9230</id><name>Станислав Попов</name></user></notifiedList></action></actions></response>')
    } else if (method == 'action.get'){
      res.send('<?xml version="1.0" encoding="UTF-8"?>\n<response status="ok"><action><id>6364522</id><description></description><type>ACTION</type><isNotRead>0</isNotRead><dateTime>13-02-2018 01:27</dateTime><fromEmail>1</fromEmail><task><id>1128468</id><title>Интеграция с toggl</title></task><project><id>9830</id><title>Стандартизация и технические решения</title></project><owner><id>9230</id><name>Станислав Попов</name></owner><analitics><analitic><id>263</id><key>611423</key><name>Выработка</name></analitic></analitics><notifiedList/></action></response>')
    } else {
      res.status(400)
      res.send("")
    }
  }
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
