const YAML = require('yaml');
const fs = require('fs');
const user = require('./user.json');
import { AdapterService } from '../AdapterService';

const functions = {
  fetchRoles(context: any) {
    return context.email == 'jhonDoe@gmail.com' ? 'admin' : 'user';
  },
};

const processors = {
  $to_cents: function (contextValue) {
    return contextValue * 1000;
  },
};

const text = fs.readFileSync(`./examples/user_adapter.yaml`, 'utf8');
const config = YAML.parse(text);
const result = new AdapterService(config, user, {
  functions,
  processors,
}).run();

console.log(result);
