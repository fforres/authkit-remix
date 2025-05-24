import type { AuthKitConfig } from './interfaces.js';

/**
 * Configuration class for AuthKit.
 * This class is used to manage configuration values and provide defaults.
 * It also provides a way to get configuration values from environment variables.
 * @internal
 */
export class Configuration {
  private config: Partial<AuthKitConfig> = {
    cookieName: 'wos-session',
    apiHttps: true,
    // Defaults to 400 days, the maximum allowed by Chrome
    // It's fine to have a long cookie expiry date as the access/refresh tokens
    // act as the actual time-limited aspects of the session.
    cookieMaxAge: 60 * 60 * 24 * 400,
    apiHostname: 'api.workos.com',
  };

  private readonly requiredKeys: (keyof AuthKitConfig)[] = ['clientId', 'apiKey', 'redirectUri', 'cookiePassword'];

  private updateConfig(config: Partial<AuthKitConfig>): void {
    this.config = { ...this.config, ...config };
  }

  configure(config: Partial<AuthKitConfig>): void {
    this.updateConfig(config);

    // Validate the cookiePassword if provided
    if (this.config.cookiePassword && this.config.cookiePassword.length < 32) {
      throw new Error('cookiePassword must be at least 32 characters long');
    }
  }

  getValue<K extends keyof AuthKitConfig>(key: K): AuthKitConfig[K] {
    if (key in this.config && this.config[key] != undefined) {
      return this.config[key] as AuthKitConfig[K];
    }

    if (this.requiredKeys.includes(key)) {
      throw new Error(`Missing required configuration value for ${key}.`);
    }

    return undefined as AuthKitConfig[K];
  }
}

export function createConfiguration(config: Partial<AuthKitConfig> = {}): Configuration {
  const configuration = new Configuration();
  configuration.configure(config);
  return configuration;
}

export function resolveConfiguration(config?: Partial<AuthKitConfig> | Configuration): Configuration {
  if (config instanceof Configuration) {
    return config;
  }

  return createConfiguration(config ?? {});
}
