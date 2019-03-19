import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../index';
import * as path from 'path';
import { configToken } from './../index';

describe('Can load with envs with async', () => {
  it('Can load envs', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync({
          glob: path.resolve(
            __dirname,
            '__stubs__',
            'config',
            '**/!(*.d).{ts,js}',
          ),
          dotenv: {
            path: path.resolve(__dirname, '__stubs__', '.env'),
          },
        }),
      ],
    }).compile();

    expect(module.get(configToken('set_by_manual')).get('test')).toEqual(2999);
  });

  it('Can load envs with sync', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(
          {
            __provide: 'testings',
            port: parseInt(process.env.PORT),
          },
          {
            path: path.resolve(__dirname, '__stubs__', '.env'),
          },
        ),
      ],
    }).compile();

    expect(module.get(configToken('testings')).get('port')).toBe(2999);
  });
});
