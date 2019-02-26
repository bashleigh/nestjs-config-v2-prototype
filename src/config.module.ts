import {Module, Global, DynamicModule, Provider} from '@nestjs/common';
import {ConfigService} from './config.service';

@Global()
@Module({})
export class ConfigModule {
  public static forRoot(config: object): DynamicModule {
		return {
			module: ConfigModule,
			providers: [

			],
			exports: [],
		};
	}

	public static async forRootAsync(glob: string): Promise<DynamicModule> {
		const configs = await ConfigService.getConfigFiles(glob);
		const providers: Provider[] = [];

		configs.forEach(config => providers.push(ConfigService.loadFile(config)));

		return {
			module: ConfigModule,
			providers,
			exports: providers,
		};
	}
}