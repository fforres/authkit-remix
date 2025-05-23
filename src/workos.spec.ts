import type { AuthKitConfig } from './interfaces.js';

jest.mock('@workos-inc/node', () => ({ WorkOS: jest.fn() }));

import { getWorkOS } from './workos.js';
import { WorkOS } from '@workos-inc/node';

const config: AuthKitConfig = {
  apiKey: 'sk_test_1234567890',
  clientId: 'client_1234567890',
  cookiePassword: 'kR620keEzOIzPThfnMEAba8XYgKdQ5vg',
  redirectUri: 'http://localhost:5173/callback',
  apiHostname: 'api.workos.com',
  apiHttps: true,
  cookieMaxAge: 60,
  cookieName: 'wos-session',
};

describe('workos', () => {
  const options = {
    apiHostname: config.apiHostname,
    https: true,
    port: undefined,
    appInfo: {
      name: 'authkit-remix',
      version: expect.any(String),
    },
  } as const;

  beforeEach(() => {
    (WorkOS as jest.Mock).mockClear();
  });

  it('should initialize WorkOS with correct API key', () => {
    const workos = getWorkOS(config);
    expect(WorkOS).toHaveBeenCalledWith(config.apiKey, expect.objectContaining(options));
    expect(workos).toBeDefined();
  });

  it('sets https when WORKOS_API_HTTPS is set', () => {
    const workos = getWorkOS({ ...config, apiHttps: false });
    expect(WorkOS).toHaveBeenCalledWith(config.apiKey, expect.objectContaining({
      ...options,
      https: false,
    }));
    expect(workos).toBeDefined();
  });

  it('includes port when provided', () => {
    const workos = getWorkOS({ ...config, apiPort: 3000 });
    expect(WorkOS).toHaveBeenCalledWith(config.apiKey, expect.objectContaining({
      ...options,
      port: 3000,
    }));
    expect(workos).toBeDefined();
  });
});
