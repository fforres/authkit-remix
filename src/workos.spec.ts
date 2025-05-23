import type { WorkOS as WorkOSType } from '@workos-inc/node';
import type { AuthKitConfig } from './interfaces.js';

describe('workos', () => {
  const config = {
    apiKey: 'sk_test_1234567890',
    clientId: 'client_1234567890',
    cookiePassword: 'kR620keEzOIzPThfnMEAba8XYgKdQ5vg',
    redirectUri: 'http://localhost:5173/callback',
    cookieDomain: 'example.com',
    apiHostname: 'api.workos.com',
  } as const;

  const options = {
    apiHostname: config.apiHostname,
    https: true,
    port: undefined,
    appInfo: {
      name: 'authkit-remix',
      version: expect.any(String),
    },
  } as const;

  let getWorkOS: (config?: Partial<AuthKitConfig>) => WorkOSType;
  let WorkOS: typeof WorkOSType;

  beforeEach(async () => {
    jest.resetModules();
    ({ getWorkOS } = await import('./workos.js'));
  });

  it('should initialize WorkOS with correct API key', async () => {
    jest.mock('@workos-inc/node', () => ({ WorkOS: jest.fn() }));
    ({ getWorkOS } = await import('./workos.js'));
    ({ WorkOS } = await import('@workos-inc/node'));
    const workos = getWorkOS(config);

    expect(WorkOS).toHaveBeenCalledWith(config.apiKey, expect.objectContaining(options));
    expect(workos).toBeDefined();
  });

  it('sets https when WORKOS_API_HTTPS is set', async () => {
    jest.mock('@workos-inc/node', () => ({ WorkOS: jest.fn() }));
    ({ getWorkOS } = await import('./workos.js'));
    ({ WorkOS } = await import('@workos-inc/node'));
    const workos = getWorkOS({ ...config, apiHttps: false });

    expect(WorkOS).toHaveBeenCalledWith(config.apiKey, expect.objectContaining({ ...options, https: false }));
    expect(workos).toBeDefined();
  });

  it('does not set the port when not provided', async () => {
    jest.mock('@workos-inc/node', () => ({ WorkOS: jest.fn() }));
    ({ getWorkOS } = await import('./workos.js'));
    ({ WorkOS } = await import('@workos-inc/node'));
    const workos = getWorkOS({ ...config, apiPort: 3000 });

    expect(WorkOS).toHaveBeenCalledWith(config.apiKey, expect.objectContaining({ ...options, port: 3000 }));
    expect(workos).toBeDefined();
  });
});
