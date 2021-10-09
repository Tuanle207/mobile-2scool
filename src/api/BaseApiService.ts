import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import { configEnv } from './@config';
import { configHttpRequest, configHttpResponse } from './@helper/network/interceptors';

export const getDefaultOAuthOptions = () => {
  const { oAuthConfig } = configEnv();
  return {
    'grant_type': 'password',
    'scope': 'offline_access Scool',
    'client_id': 'Scool_App',
    'client_secret': '1q2w3e*',
  };
};

// const token = useSelector((state: RootState) => state.auth.access_token)
// export const header = {
//   headers: {
//     'Authorization': token
//   }
// }

export const baseUrl = 'http://10.0.2.2:5000'