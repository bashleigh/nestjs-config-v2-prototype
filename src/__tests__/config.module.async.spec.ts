import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../index';
import * as path from 'path';
import TestConfigClass from './__stubs__/config/test';
import { configToken } from './../index';
import { Config } from '../config';
import { InjectConfig } from '../decorators';

describe('ConfigModule.forRootAsync', () => {
  it('can instance', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    expect(module.get(ConfigModule)).toBeInstanceOf(ConfigModule);
  });

  it('Should Have provider TestConfigClass', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    expect(module.get(TestConfigClass)).toBeInstanceOf(TestConfigClass);
  });

  it('Should have manual provider', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    expect(module.get(configToken('set_by_manual'))).toBeInstanceOf(Config);
  });

  it('Should be able to inject defined config', async () => {
    class TestClass {
      constructor(
        @InjectConfig('set_by_manual') private readonly config: Config,
      ) {}

      getConfig() {
        return this.config.get<number>('test');
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
      providers: [TestClass],
    }).compile();

    expect(module.get(TestClass).getConfig()).toBe(3000);
  });

  it('Should be able to inject file named config', async () => {
    class TestClass {
      constructor(
        @InjectConfig('file_named') private readonly config: Config,
      ) {}

      getConfig() {
        return this.config.get<string>('test');
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
      providers: [TestClass],
    }).compile();

    expect(module.get(TestClass).getConfig()).toBe('hello again');
  });

  it('Should be able to inject __provide over __name config', async () => {
    class TestClass {
      constructor(
        @InjectConfig('testy_test') private readonly config: Config,
      ) {}

      getConfig() {
        return this.config.get<string>('test');
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
      providers: [TestClass],
    }).compile();

    expect(module.get(TestClass).getConfig()).toBe('hello');
  });

  // TODO figure out why this doesn't pass?
  // it('Should be able to inject typed config', async () => {

  //   class TestClass {
  //     constructor(private readonly config: TestConfigClass) {}

  //     getConfig() {
  //       console.log('getconfig', this.config);
  //       return this.config.port;
  //     }
  //   }

  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       ConfigModule.forRootAsync(
  //         path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
  //       ),
  //     ],
  //     providers: [
  //       {
  //         provide: 'testing',
  //         useFactory: (config: TestConfigClass) => console.log('config', config),
  //         inject: [TestConfigClass],
  //       },
  //       TestClass,
  //     ],
  //   }).compile();

  //   console.log('test', module.get(TestClass));

  //   expect(module.get(TestClass).getConfig()).toBe(0);
  // });
});
