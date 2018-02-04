const common = require('./common')
const settings = require('electron-settings');

// при изменении input сразу сохраняем в settings (он лежит в AppData)
common.opts.forEach(function(name){
    var input;
    input = document.querySelector('input[name="' + name + '"]');
    var value = settings.get(name, common.defaults[name]||"");
    input.value = value;
    input.addEventListener('change', function(){
        settings.set(name, input.value);
    });
});
