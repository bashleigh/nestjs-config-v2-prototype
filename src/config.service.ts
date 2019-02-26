import { Glob } from "glob";
import {Config} from './config';
import {createProvider} from './utils';

export class ConfigService {

	public static root(path: string = ''): string {
		return 
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

	public static loadFile(file: string) {
		const required = require(file);

		console.log('required', required.default['prototype']);
		const provider = createProvider(required.default, file);

		console.log('provider', provider);

	}
}