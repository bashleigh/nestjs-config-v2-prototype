import { Type } from '@nestjs/common';

export interface ConfigInterface {
  [s: string]: any;
}

export interface DefinedConfigProvider extends ConfigInterface {
  __name?: string;
  __provide: string;
}

export interface DynamicConfigProvider extends ConfigInterface, Type<any> {}

export declare type ConfigProvider =
  | DefinedConfigProvider
  | DynamicConfigProvider;
