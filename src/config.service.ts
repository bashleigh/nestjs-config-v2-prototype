import { Glob } from "glob";
import {createProvider, configToken} from './utils';
import { Provider, } from "@nestjs/common";
import {ModuleRef} from '@nestjs/core';
import * as path from 'path';
import { ConfigProvider } from "./types";

export class ConfigService {

	protected static rootPath?: string;

	constructor(private readonly moduleRef: ModuleRef) {}

	public static root(dir: string = ''): string {
		const rootPath =
      this.rootPath || path.resolve(process.cwd());
    return path.resolve(rootPath, dir);
	}

  public static async getConfigFiles(glob: string): Promise<string[]> {
		return new Promise((resolve, rejects) => {
			new Glob(glob, {}, (err, matches) => {
				if (err) {
					rejects(err);
				} else {
					resolve(matches);
				}
			});
		});
	}

	public static loadFile(file: string): Provider {
		const required = require(file);

		return createProvider(required.default, file);
	}

	protected findConfigProvider(token: string): ConfigProvider | null {
		return this.moduleRef.get(configToken(token));
	}

	// public get<T>(pattern: string | string[], value: any = undefined): T {
	// 	// TODO find the module from the pattern
	// 	// TODO resolve value
	// 	// TODO return value
	// }
}