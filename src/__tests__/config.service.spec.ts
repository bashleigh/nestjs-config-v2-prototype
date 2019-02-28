import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from './../index';
import * as path from 'path';

describe('ConfigModule.forRoot', async () => {
  it('ConfigService can call get with __provide reference', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    const service = module.get(ConfigService);

    expect(service.get('set_by_manual.test')).toBe(3000);
  });

  it('ConfigService can call get with __name reference', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    const service = module.get(ConfigService);

    expect(service.get('tester_test.test')).toBe('hello');
  });

  it('ConfigService can call get with file name reference', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    const service = module.get(ConfigService);

    expect(service.get('file_named.test')).toBe('hello again');
  });
});
