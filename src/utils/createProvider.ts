import { Provider } from '@nestjs/common';
import { ConfigProvider, DynamicConfigProvider } from '../types';
import { configToken } from './configToken';
import { Config } from './../config';
import * as path from 'path';

export function createProvider(
  configProvider: ConfigProvider,
  wholePath: string,
): Provider {
  const fileName = path.basename(wholePath, '.' + wholePath.split('.').pop());
  const provide =
    configProvider['prototype'] !== undefined
      ? configProvider
      : configToken(
          configProvider.__provide
            ? configProvider.__provide
            : configProvider.__name
            ? configProvider.__name
            : fileName,
        );
	
	return isDynamicConfigProvider(configProvider) ? {
		provide,
		useClass: configProvider,
	} : {
		provide,
		useValue: new Config(configProvider),
	};
}

function isDynamicConfigProvider(configProvider: ConfigProvider): configProvider is DynamicConfigProvider {
	return configProvider instanceof Function;
}
