var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

let loadedConfig = null;

let loaded_files = {};

const opts = [
    'userAgent',
    'sentTag',
    'smtpHost',
    'smtpPort',
    'smtpSecure',
    'planfixAccount',
    'planfixAnaliticName',

    'apiToken',
    'workspaceId',
    'smtpLogin',
    'smtpPassword',
    'emailFrom',
    'planfixAuthorName',
];

const defaults = {
    userAgent: 'planfix-toggl',
    sentTag: 'sent',
    smtpHost: 'smtp.yandex.ru',
    smtpPort: '587',
    smtpSecure: 'false',
};

function read(filename) {
  let data = yaml.load(fs.readFileSync(filename));
  loaded_files[filename] = data;
  return data;
}

function load(filename) {
  filename = path.resolve(filename);
  return loaded_files.hasOwnProperty(filename) ? loaded_files[filename] : read(filename);
}

function loadConfig(){
  return Object.assign(
    {},
    load('config.default.yml'),
    load('config.yml')
  );
}

function reloadConfig(){
  loadedConfig = loadConfig();
}

function get(name, defaultValue){
  if(!loadedConfig) loadedConfig = loadConfig();
  return loadedConfig.hasOwnProperty(name) ? loadedConfig[name] : defaultValue;
}

function getAll() {
  if(!loadedConfig) loadedConfig = loadConfig();
  return loadedConfig;
}

function set(name, value){
  throw new Error('Not implemented');
}

function getUnfilled(){
  return opts.filter(name => get(name) === undefined || get(name) === null);
}

function isSettingsFilled(){
  return getUnfilled().length === 0;
}

module.exports.defaults = defaults;
module.exports.opts = opts;

module.exports.reloadConfig = reloadConfig;

module.exports.get = get;
module.exports.getAll = getAll;
module.exports.set = set;
module.exports.getUnfilled = getUnfilled;
module.exports.isSettingsFilled = isSettingsFilled;
