import axios, { Axios } from 'axios';
import { store } from '../redux/store/store';
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
export const getApiService = async () => {

  // get token from store
  const { 
    auth: { token1 }
  } = store.getState();

  // TODO: auto get access_token when expired 
  const token = store.getState().auth.access_token;

  const axiosConfig = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    withCredentials: true,
  });

  // config axios interceptor;
  configHttpRequest(axiosConfig);
  configHttpResponse(axiosConfig);

  return axiosConfig;
};

export const baseUrl = 'http://10.0.2.2:5000'