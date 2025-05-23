import { type Configuration, resolveConfiguration } from './config.js';
import type { AuthKitConfig } from './interfaces.js';
import { getWorkOS } from './workos.js';

interface GetAuthURLOptions {
  screenHint?: 'sign-up' | 'sign-in';
  returnPathname?: string;
  organizationId?: string;
  redirectUri?: string;
  loginHint?: string;
  config?: Partial<AuthKitConfig> | Configuration;
}

export async function getAuthorizationUrl(options: GetAuthURLOptions = {}) {
  const { returnPathname, screenHint, organizationId, redirectUri, loginHint, config } = options;
  const configuration = resolveConfiguration(config);

  return getWorkOS(configuration).userManagement.getAuthorizationUrl({
    provider: 'authkit',
    clientId: configuration.getValue('clientId'),
    redirectUri: redirectUri || configuration.getValue('redirectUri'),
    state: returnPathname ? btoa(JSON.stringify({ returnPathname })) : undefined,
    screenHint,
    organizationId,
    loginHint,
  });
}
