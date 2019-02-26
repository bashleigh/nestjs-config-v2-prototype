export interface DefinedConfigProvider {
  __name?: string;
  __provider: string;
  [s: string]: any;
}

export interface DynamicConfigProvider {
  [s: string]: any;
}

export declare type ConfigProvider =
  | DefinedConfigProvider
  | DynamicConfigProvider;
