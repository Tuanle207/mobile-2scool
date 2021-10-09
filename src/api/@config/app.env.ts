import { IEnvConfig } from './common';

const appEnv: {[key: string]: IEnvConfig} = {
  development: {
    host: 'http://localhost:5000',
    appUrl: 'http://localhost:3000',
    oAuthConfig: {
      issuer: 'http://localhost:5000',
      clientId: 'Scool_App',
      responseType: 'code',
      clientSecret: '1q2w3e*',
      scope: 'offline_access openid profile role email phone Scool',
    },
    enableLogger: true
  },
  production: {
    host: 'http://localhost:5000',
    appUrl: 'http://localhost:3000',
    oAuthConfig: {
      issuer: 'http://localhost:5000',
      clientId: 'Scool_App',
      clientSecret: '1q2w3e*',
      responseType: 'code',
      scope: 'offline_access Scool',
    },
    enableLogger: false
  }
};

export default appEnv