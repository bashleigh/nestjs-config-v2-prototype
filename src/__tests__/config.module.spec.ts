import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../index';
import { ConfigService } from '../config.service';

describe('ConfigModule.forRoot', async () => {
  it('can instance', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          test: true,
        }),
      ],
    }).compile();

    expect(module.get(ConfigModule)).toBeInstanceOf(ConfigModule);
  });

  it('Should have ConfigService provider', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          test: true,
        }),
      ],
    }).compile();

    const provider = module.get(ConfigService);
    // console.log('provc', module);

    expect(provider).toBeInstanceOf(ConfigService);
  });

  it('Should be able to obtain config', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          test: true,
        }),
      ],
    }).compile();

    const provider = module.get(ConfigService);

    expect(provider.get('test')).toBe(true);
  });
});
