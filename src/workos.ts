import { WorkOS } from '@workos-inc/node';
import { type AuthKitConfig } from './interfaces.js';
import { type Configuration, resolveConfiguration } from './config.js';

const VERSION = '0.13.0';

/**
 * Create a WorkOS instance with the provided API key and optional settings.
 */
export function createWorkOSInstance(config?: Partial<AuthKitConfig> | Configuration) {
  const configuration = resolveConfiguration(config);
  // Get required API key from config
  const apiKey = configuration.getValue('apiKey');

  // Get optional settings
  const apiHostname = configuration.getValue('apiHostname');
  const apiHttps = configuration.getValue('apiHttps');
  const apiPort = configuration.getValue('apiPort');

  const options = {
    apiHostname,
    https: apiHttps,
    port: apiPort,
    appInfo: {
      name: 'authkit-remix',
      version: VERSION,
    },
  };

  // Initialize the WorkOS client with config values
  const workos = new WorkOS(apiKey, options);

  return workos;
}

/**
 * Returns a new WorkOS instance using the current configuration.
 */
export function getWorkOS(config?: Partial<AuthKitConfig> | Configuration) {
  return createWorkOSInstance(config);
}
