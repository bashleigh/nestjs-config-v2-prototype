import { TOKEN_PREFIX } from '../constsants';

export function configToken(token: string) {
  return `${TOKEN_PREFIX}_${token}`;
}
