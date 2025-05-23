import { WorkOS } from '@workos-inc/node';
import { getConfig } from './config.js';

const VERSION = '0.13.0';

/**
 * Create a WorkOS instance with the provided API key and optional settings.
 */
export function createWorkOSInstance() {
  // Get required API key from config
  const apiKey = getConfig('apiKey');

  // Get optional settings
  const apiHostname = getConfig('apiHostname');
  const apiHttps = getConfig('apiHttps');
  const apiPort = getConfig('apiPort');

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
export function getWorkOS() {
  return createWorkOSInstance();
}
