import {Module, Global, DynamicModule, Provider} from '@nestjs/common';
import {ConfigService} from './config.service';
import { createProvider } from './utils';
import { ConfigProvider } from './types';

@Global()
@Module({
  providers: [
    ConfigService,
  ],
})
export class ConfigModule {
  
  public static resolveRootPath(path: string): ConfigModule {
    ConfigService.resolveRootPath(path);
    return this;
  }

  public static forRoot(config: ConfigProvider): DynamicModule {
		const providers = [createProvider(config, '')];
		return {
			module: ConfigModule,
			providers,
			exports: providers,
		};
	}

	public static async forRootAsync(glob: string): Promise<DynamicModule> {
		const providers: Provider[] = await ConfigService.createProviders(glob);

		return {
			module: ConfigModule,
			providers,
			exports: providers,
		};
	}
}
