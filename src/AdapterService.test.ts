const YAML = require('yaml');
const fs = require('fs');
const user = require('../examples/user.json');
import { AdapterService } from './AdapterService';

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

describe('AdapterService', () => {
  describe('#run', () => {
    it('success', () => {
      const result = new AdapterService(config, user, {
        functions,
        processors,
      }).run();
      expect(result).toEqual({
        avatarUrl: 'https://avatar.com/jhon',
        billingAddress: 'addresses.billing',
        budget_in_cents: 100000,
        fullname: 'Jhon Doe',
        id: 'a190f1a6-2fb8-77d9-fbb9-9b8a19e441e3',
        name: 'Jhon',
        provider: 'google',
        roles: 'admin',
      });
    });

    it('not found function', () => {
      try {
        new AdapterService(config, user, {
          processors,
        }).run();
      } catch (e) {
        expect(e.message).toBe('Function fetchRoles is not defined');
      }
    });
  });
});
