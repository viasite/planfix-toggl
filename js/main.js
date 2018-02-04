const toggl = require('./toggl');
const common = require('./common');

var log = document.getElementById('log');
var addLog = function(text){
    var div = document.createElement('div');
    div.textContent = text;
    log.appendChild(div);
    console.log(text);
};

const sendButton = document.getElementById('send-to-planfix')
sendButton.addEventListener('click', toggl.sendToPlanfix);

// кнопка неактивна, пока не заполнены все настройки
if(!common.isSettingsFilled()){
    sendButton.setAttribute('disabled', true);
    addLog('Please, fill settings');
}