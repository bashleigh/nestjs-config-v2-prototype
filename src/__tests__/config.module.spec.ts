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

    //console.log('m', module);
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

    expect(provider).toBeInstanceOf(ConfigService);
  });
});
