import * as get from 'lodash.get';

export class Config {

	[s: string]: any;

	constructor(config: {
		[s: string]: any,
	}) {
		Object.keys(config).forEach((key) => this[key] = config[key]);
	};

	get<T>(pattern: string | string[], value: any = undefined): T {
		const fetched = get(this, pattern);

		return typeof fetched !== 'undefined' ? fetched : value;
	}
};
