import { Glob } from 'glob';
import {createProvider} from './utils';
import { Provider, Injectable } from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import * as path from 'path';
import { ConfigProvider } from './types';
import * as assert from 'assert';
import { Config } from './config';
import * as get from 'lodash.get';
import { TOKEN_PREFIX } from './constsants';

@Injectable()
export class ConfigService {

	protected static rootPath?: string;
	protected static tokenReferences: {[s: string]: string} = {};
	protected static mode: 'sync' | 'async' = 'sync';

	constructor(private readonly moduleRef: ModuleRef) {}

	public static root(dir: string = ''): string {
		const rootPath =
      this.rootPath || path.resolve(process.cwd());
    return path.resolve(rootPath, dir);
	}

	public static resolveRootPath(dir: string): typeof ConfigService {
		assert.ok(
      path.isAbsolute(dir),
      'Start path must be an absolute path.',
		);
		if (!this.rootPath) {
      const root = this.root();

      let workingDir = dir;
      let parent = path.dirname(dir);

      while (workingDir !== root && parent !== root && parent !== workingDir) {
        workingDir = parent;
        parent = path.dirname(workingDir);
      }

      this.rootPath = workingDir;
		}
		
		return this;
	}

  public static async getConfigFiles(glob: string): Promise<string[]> {
		return new Promise((resolve, rejects) => {
			new Glob(glob, {
				cwd: this.root(),
			}, (err, matches) => {
				if (err) {
					rejects(err);
				} else {
					resolve(matches);
				}
			});
		});
	}

	public static async createProviders(glob: string): Promise<Provider[]> {
		ConfigService.mode = 'async';
		const files = await this.getConfigFiles(glob);
		const providers: Provider[] = [];
		
		files.forEach(file => {
			providers.push(this.loadFile(file));
		});

		return providers;
	}

	public static loadFile(file: string): Provider {
		const required = require(file);
		const provider = createProvider(required.default, file);

		if (!provider.hasOwnProperty('useClass')) {
			this.setReference(
				required.default.__name || required.default.__provide || path.basename(file, '.' + file.split('.').pop()), 
				provider.provide
			);
		}

		return provider;
	}

	protected findConfigProvider(token: string): ConfigProvider | null {
		return this.moduleRef.get(token);
	}

	protected resolveTokenFromName(name: string): string | null {
		return Object.keys(ConfigService.tokenReferences).includes(name) ? ConfigService.tokenReferences[name] : null;
	}

	protected static setReference(name: string, token: string): typeof ConfigService {
		ConfigService.tokenReferences[name] = token;
		return this;
	}

	protected getNameAndAshPatternFromPattern(pattern: string): [string, string] {
		const parts = pattern.split('.');
		return [parts.shift(), parts.join('.')];
	}

	public get<T>(pattern: string, value: any = undefined): T | undefined {

		let provider: ConfigProvider | null;
		let ashPattern: string;

		if (ConfigService.mode === 'sync') {
			provider = this.findConfigProvider(TOKEN_PREFIX);
			ashPattern = pattern;
		} else {
			let name: string;
			[name, ashPattern] = this.getNameAndAshPatternFromPattern(pattern);
			provider = this.findConfigProvider(this.resolveTokenFromName(name));
		}
		
		if (!provider) {
			return value;
		}

		if (provider instanceof Config) {
			return provider.get<T>(ashPattern, value);
		} 
		
		const result = get(provider, ashPattern);

		return result ? result : value;
	}
}