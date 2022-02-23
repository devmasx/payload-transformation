const deepKeys = require('deep-keys');
const _ = require('lodash');

export class AdapterService {
  functions: Record<string, (context: Record<any, any>) => any>;
  processors: Record<
    string,
    (contextValue: any, value: string | string[]) => any
  >;

  mapping: Record<any, any>;
  mappingKeys: Record<string, any>;

  constructor(
    public config: { mapping: Record<any, any> },
    public context: Record<any, any>,
    { functions = {}, processors = {} },
  ) {
    this.functions = functions;
    this.processors = processors;
    this.mapping = config.mapping;
    this.mappingKeys = deepKeys(this.mapping);
  }

  run(): Record<any, any> {
    return this.mappingKeys.reduce((result, key) => {
      const value = _.get(this.mapping, key);
      const [fieldName, computedValue] = this.process(key, value);
      _.set(result, fieldName, computedValue);
      return result;
    }, {});
  }

  process(key: string, value: string) {
    const operation: string = _.last(key.split('.'));
    if (/\$/.test(operation)) {
      const fieldName = key.replace(`.${operation}`, '');
      const contextValue = _.get(this.context, value);
      const computedValue = this.getProcessors(operation)(contextValue, value);
      return [fieldName, computedValue];
    }
    const computedValue = _.get(this.context, value);

    return [key, computedValue];
  }

  getProcessors(operation: string) {
    const cases = {
      $or: (_contextValue, value) =>
        value.find((it) => _.get(this.context, it)),
      $value: (_contextValue, value) => value,
      $concat: (_contextValue, value) => {
        return value.map((it) => _.get(this.context, it) || it).join('');
      },
      $fnc: (_contextValue, value) => {
        if (!this.functions[value]) {
          throw new Error(`Function ${value} is not defined`);
        }

        return this.functions[value](this.context);
      },
    };

    return cases[operation] || this.processors[operation];
  }
}
