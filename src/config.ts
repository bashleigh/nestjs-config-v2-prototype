import * as get from 'lodash.get';

export class Config {

	constructor(protected readonly config: {
		[s: string]: any,
	}) {};

	get<T>(pattern: string | string[], value: any = undefined): T {
		const fetched = get(this.config, pattern);

		return typeof fetched !== 'undefined' ? fetched : value;
	}
};
