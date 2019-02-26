import {Module, Global, DynamicModule} from '@nestjs/common';
import {ConfigService} from './config.service';

@Global()
@Module({})
export class ConfigModule {
  public static forRoot(config: object): DynamicModule {
		console.log(config);
		return {
			module: ConfigModule,
			providers: [

			],
			exports: [],
		};
	}

	public static async forRootAsync(glob: string): Promise<DynamicModule> {
		const configs = await ConfigService.getConfigFiles(glob);
		console.log(configs);

		configs.forEach(config => ConfigService.loadFile(config));

		return {
			module: ConfigModule,
			providers: [],
			exports: [],
		};
	}
}