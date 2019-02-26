import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../index';
import * as path from 'path';
import TestConfigClass from './__stubs__/config/test';
import {configToken} from './../index';
import { Config } from '../config';

describe('ConfigModule.forRootAsync', async () => {
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
});
