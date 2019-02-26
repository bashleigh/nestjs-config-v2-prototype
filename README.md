# Nestjs-config v2 prototype

After creating this [proposal](https://github.com/nestjs-community/nestjs-config/issues/54) I decided to create this prototype before attempting to modify the existing code base. This also enables me to create a fresh scenario to test my logic and new implementation of features etc.

## Testing

```bash
$ yarn test
```

This prototype will hopefully enable a better solution to using the nestjs-config module and be more of a 'nest' implementation of the existing module and utilise more of the nestjs container instead of 'bunging' everyrthing into one provider thus providing a better usage of nestjs and the config module.

## Examples

### Injecting

Injecting will move away from a singular module inject and enable more freely injectable providers as such

#### Inject via token

Basic objects can be injected using a token

```typescript
import {InjectConfig} from 'nestjs-config';
import {Controller} from '@nestjs/common';

@Controller()
export class ExampleController {
  constructor(private readonly @InjectConfig('controller') config) {}
}
```

#### Inject via Type

Typed classes etc can be used to inject your config

```typescript
// config/my.config.class.ts
export default class MyConfigClass {
  public static test: string = 'hello';
}
```

```typescript
import { MyConfigClass } from './config/my.config.class';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleProvider {
  constructor(private readonly config: MyConfigClass) {}

  someMethod(): string {
    return this.config.test;
  }

  anotherMethod(): string {
    return this.config.get<string>('not.defined', 'default value');
  }

  getConfig(): MyConfigClass {
    return this.config;
  }
}
```

#### Defined tokens injection

The token used can be manipulated as such

```typescript
// config/my.defined.provide.ts
export default {
  __provide: 'my_custom_token',
};
```

```typescript
import {Injectable} from '@nestjs/common';

Injectable()
export class ExampleProvider {
	constructor(private readonly @InjectConfig('my_custom_provider') config) {}
}
```

Again the above should work with Provider types such as

```typescript
// config/database.ts

export default class DatabaseConfig implements TypeOrmModuleOptions {
  public static type: string = 'mysql';
  public static host: process.env.TYPEORM_HOST,
  public static port: process.env.TYPEORM_PORT,
  public static username: process.env.TYPEORM_USERNAME,
  public static password: process.env.TYPEORM_PASSWORD,
}
```

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRootAsync('config/**/*(!.d).{ts,js}'),
    TypeOrmModule.forRootAsync({
      useFactory: (config: DatabaseConfig) => config,
      injects: [DatabaseConfig],
    }),
  ],
})
export class ExampleModule {}
```

Alternatively using no class/type

```typescript
// config/database.ts
export default {
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  ...
}
```

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, configToken } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRootAsync('config/**/*(!.d).{ts,js}'),
    TypeOrmModule.forRootAsync({
      useFactory: config => config,
      injects: [configToken('database')],
    }),
  ],
})
export class ExampleModule {}
```

By default the file name is used for the token if no `__provide` key is specified.

## TODO

- [ ] forRoot method
- [ ] merging for modules
- [ ] dotenv loading
- [ ] resolveRootPath
- [ ] documentation comments
- [ ] throw exception on no default export from file? Or consider what to do if multiple exports
- [ ] validating config types etc
- [ ] add configService back into configModule and resolve names with references of their token 
- [ ] add rename method etc
- [ ] add configModuleOptions back in
- [ ] attempt static property setting with decorator
- [ ] attempt better parameter decorator setter
