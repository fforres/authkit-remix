import { createCookie, createMemorySessionStorage } from '@remix-run/node';
import { SessionStorageManager, configureSessionStorage, getSessionStorage, errors } from './sessionStorage.js';

const baseConfig = {
  clientId: 'client_123',
  apiKey: 'sk_123',
  redirectUri: 'https://example.com',
  cookiePassword: 'a'.repeat(32),
};

describe('SessionStorageManager', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('throws if getSessionStorage called before configure', async () => {
    const manager = new SessionStorageManager();
    await expect(manager.getSessionStorage()).rejects.toThrow(errors.configureSessionStorage);
  });

  it('creates storage with defaults', async () => {
    const manager = new SessionStorageManager();
    const { cookieName, getSession } = await manager.configure({ config: baseConfig });
    const storage = await manager.getSessionStorage();
    expect(cookieName).toBe('wos-session');
    expect(getSession).toBeDefined();
    expect(storage.cookieName).toBe('wos-session');
  });

  it('uses provided storage implementation', async () => {
    const cookie = createCookie('_cookie');
    const custom = createMemorySessionStorage({ cookie });
    const manager = new SessionStorageManager();
    const result = await manager.configure({ storage: custom, cookieName: '_cookie', config: baseConfig });
    expect(result.cookieName).toBe('_cookie');
    expect(await manager.getSessionStorage()).toEqual({ ...custom, cookieName: '_cookie' });
  });
});

describe('singleton helpers', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('configures and retrieves storage', async () => {
    const { cookieName } = await configureSessionStorage({ config: baseConfig });
    const storage = await getSessionStorage();
    expect(cookieName).toBe('wos-session');
    expect(storage.cookieName).toBe('wos-session');
  });
});
