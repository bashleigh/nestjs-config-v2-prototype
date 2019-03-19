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
// config/my_config.ts
export default {
  test: string = 'hello';
}
```

```typescript
import {InjectConfig} from 'nestjs-config';
import {Controller} from '@nestjs/common';

@Controller()
export class ExampleController {
  constructor(private readonly @InjectConfig('my_config') config) {}

  someMethod(): string {
    return this.config.test;
  }

  anotherMethod(): string {
    return this.config.get<string>('not.defined', 'default value');
  }
}
```

In the above example you'll notice that there is a method `get` on the injected config parameter. That's because all object configs are 'wrapped' in a `Config` class which provides such lodash get functionality like in the previous version of `nestjs-config`. Except now it has a Type Parameter (**Thanks @natc ;)**).

#### Inject via Type

Typed classes etc can be used to inject your config. 

In this example the class used does not come with the `get` functionality although you could extend the config class if you so wished `export default class MyConfigClass extends Config {}`.

All 'types' are used as `ClassProvider`s. So they are technically injectables?

```typescript
// config/my.config.class.ts
export default class MyConfigClass {
  public static test: string = 'hello';
}
```

```typescript

@Module({
  imports: [
    ConfigModule.forRootAsync(path.resolve(__dirname, 'config', '**', '*(!.d).{ts,js}')),
    SomeModle.forRootAsync({
      useFactory: (conifg: MyConfigClass) => config,
      inject: [MyConfigClass],
    }),
  ],
})
export class ExampleModule {}
```

The below will not work as ConfigProviders are created asynchronously via the ConfigModule.

```typescript
import { MyConfigClass } from './config/my.config.class';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleProvider {
  constructor(private readonly config: MyConfigClass) {}
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
	constructor(private readonly @InjectConfig('my_custom_token') config) {}
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
import DatabaseConfig from './config/database';

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

### Using the ConfigService

In my proposal I wasn't sure if the ConfigService still had a role within the config module. However I've managed to maintain some of the v1 functionality by utiling the moduleRef and keeping local references of the `__name`,`__provide` or file name of the provider's token being created. I'm not sure I like this functionality as it is; as a provider currently cannot be found using a ClassProvider token which is kinda sad. Would be nice but not quite sure how it would really work? Plus using the moduleRef seems a little hacky and kind of defeats the purpose of types before runtime. 

```typescript
import {Injectable} from '@nestjs/common';
import {ConfigService} from 'nestjs-config';

@Injectable()
export class ExampleProvider {
  constructor(private readonly configService: ConfigService) {}

  someMethod(): string {
    return this.configService.get<string>('my_config.test', 'something that doesn\'t say hello');
  }
}
```

## Merge 

Merge has been remove in v2, the prefered method is to use `ConfigModule.forRootAsync` in your module.

## Renaming method

The renaming method has been removed as of v2. The perfered method now is to define your name/provide token using the `__name` or `__provide` keys defined in `DefinedConfigProvider`.


## TODO

- [x] forRoot method
- [x] ~~merging for modules~~ (Might as well use comfigModule.forRootAsync?)
- [x] dotenv loading
- [x] resolveRootPath
- [x] documentation comments
- [ ] throw exception on no default export from file? Or consider what to do if multiple exports
- [ ] throw exception on no defined config provider
- [x] throw exception when no reference token is found
- [ ] validating config types etc with different package/drivers
- [x] add configService back into configModule and resolve names with references of their token 
- [x] ~~add rename method etc (do I still need this with __name || __provide?)~~
- [x] add configModuleOptions back in
- [x] ~~attempt static property setting with decorator~~ don't need it 
- [x] ~~attempt better parameter decorator setter~~ don't need it 
- [ ] consider replacing loadash.get with ts-get
- [x] ~~make sure injection via type works correctly~~ Won't work because the token doesn't exist before injectable is instanced
- [x] make a 'toString' or 'toObject' method for when calling as `config` as the tokens would require `useFactory: (config: Config) => config.config)` bit annoying. Maybe just define to Config instead of Config.config 