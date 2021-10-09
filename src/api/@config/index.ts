import appEnv from './app.env';
import { ENV_NAME, IEnvConfig } from './common';

export function configEnv(): IEnvConfig {
  const envName = process.env.NODE_ENV || 'development';
  const envNameApp = ENV_NAME[envName] || 'development';
  const platform = process.env.REACT_APP_PLATFORM || 'mobile';
  const config = appEnv[envNameApp];
  config.platform = platform;
  return config;
}