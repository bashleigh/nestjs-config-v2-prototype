import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../index';
import * as path from 'path';

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
});
