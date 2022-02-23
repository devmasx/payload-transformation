# Payload transformation

Using a yaml configuration you can tranform a payload to another payload

### Example:

_config:_

```yaml
mapping:
  name: name
  last_name: lastName
  fullname:
    $concat: [name, ' ', lastname]
```

_input:_

```json
{
  "name": "Jhon",
  "lastname": "Doe"
}
```

_output:_

```json
{
  "name": "Jhon",
  "last_name": "Doe",
  "fullName": "Jhon Doe"
}
```

## Avilable operators

### $or

Apply an or operation between context values

```yaml
billingAddress:
  $or: [addresses.billing, addresses.main]
```

_equivalent:_

```js
const billingAddress = context.addresses?.billing || context.addresses?.main;
```

### $concat

Concat context values

Example:

```yaml
fullName:
  $concat: [name, ' ', lastName]
```

_equivalent:_

```js
const fullName = `${context.name} ${$context.lastName}`;
```

### $value

Return the harcoded value without read from the context

_Example:_

```yaml
country:
  $value: US
```

_equivalent:_

```js
const country = 'US';
```

### $fnc

Call a function with the context

_Initialization:_

```yaml
roles:
  $fnc: fetchRoles
```

```ts
const functions = {
  fetchRoles(context) {
    return context.roles.split(',');
  },
};

const adapter = new AdapterService(config, context, {
  functions,
});
```

_equivalent:_

```js
function fetchRoles(context) {
  return context.roles.split(',');
}

const roles = fetchRoles(context);
```
