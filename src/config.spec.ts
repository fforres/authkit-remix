import { Configuration, createConfiguration, resolveConfiguration } from './config.js';
import type { AuthKitConfig } from './interfaces.js';

describe('createConfiguration and resolveConfiguration', () => {
  const baseConfig: AuthKitConfig = {
    clientId: 'client_123',
    apiKey: 'sk_123',
    redirectUri: 'https://example.com/callback',
    cookiePassword: 'a'.repeat(32),
    apiHostname: 'api.workos.com',
    apiHttps: true,
    cookieName: 'wos-session',
    cookieMaxAge: 60,
  };

  it('creates a configuration instance with provided values', () => {
    const config = createConfiguration(baseConfig);
    expect(config).toBeInstanceOf(Configuration);
    // Environment variables from jest.setup.ts take precedence
    expect(config.getValue('clientId')).toBe(process.env.WORKOS_CLIENT_ID);
    expect(config.getValue('cookiePassword')).toBe(process.env.WORKOS_COOKIE_PASSWORD);
  });

  it('resolveConfiguration returns same instance if passed', () => {
    const config = createConfiguration(baseConfig);
    const resolved = resolveConfiguration(config);
    expect(resolved).toBe(config);
  });

  it('throws when required value is missing', () => {
    const originalApiKey = process.env.WORKOS_API_KEY;
    delete process.env.WORKOS_API_KEY;
    const config = createConfiguration({
      clientId: 'id',
      redirectUri: 'https://example.com',
      cookiePassword: 'a'.repeat(32),
    });
    expect(() => config.getValue('apiKey')).toThrow();
    process.env.WORKOS_API_KEY = originalApiKey;
  });
});
