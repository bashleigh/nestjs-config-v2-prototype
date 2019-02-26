import { Provider } from '@nestjs/common';
import { ConfigProvider } from '../types';
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
      ? configProvider['prototype']
      : configToken(
          configProvider.__provider
            ? configProvider.__provider
            : configProvider.__name
            ? configProvider.__name
            : fileName,
        );

  delete configProvider.__name;
  delete configProvider.__provide;

  configProvider =
    configProvider['prototype'] == undefined
      ? new Config(configProvider)
      : configProvider;

  return {
    provide,
    useValue: configProvider,
  };
}
