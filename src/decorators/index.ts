import { Inject } from '@nestjs/common';
import { configToken } from './../utils';

export function InjectConfig (token: string) {
	return Inject(configToken(token));
}
