import { Type } from '@nestjs/common';

export interface IConfig {
  [s: string]: any;
}

export interface DefinedConfigProvider extends IConfig {
  __name?: string;
  __provide: string;
}

export interface DynamicConfigProvider extends IConfig, Type<any> {}

export declare type ConfigProvider =
  | DefinedConfigProvider
  | DynamicConfigProvider;
