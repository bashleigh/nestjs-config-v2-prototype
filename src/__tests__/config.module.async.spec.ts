import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../index';
import * as path from 'path';

describe('ConfigModule.forRootAsync', async () => {
  it('can instance', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRootAsync(
          path.resolve(__dirname, '__stubs__', 'config', '**/!(*.d).{ts,js}'),
        ),
      ],
    }).compile();

    //console.log('m', module);
  });
});
