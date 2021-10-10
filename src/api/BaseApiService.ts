import Axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';
import { store } from '../redux/store/stote';
import { configEnv } from './@config';
import { configHttpRequest, configHttpResponse } from './@helper/network/interceptors';

export const baseUrl = 'http://10.0.2.2:5000';


export const getDefaultOAuthOptions = () => {
  const { oAuthConfig } = configEnv();
  return {
    'grant_type': 'password',
    'scope': 'offline_access Scool',
    'client_id': 'Scool_App',
    'client_secret': '1q2w3e*',
  };
};

export const getApiService = async () => {

  // get token from store
  const { 
    auth: { token }
  } = store.getState();

  // TODO: auto get access_token when expired 

  const axios = Axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  // config axios interceptor;
  configHttpRequest(axios);
  configHttpResponse(axios);

  return axios;
};
