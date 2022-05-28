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
export const getApiServiceFormData = async ({queryActiveCourse, queryCurrentAccount}: {queryActiveCourse?: boolean, queryCurrentAccount?: boolean} = {
  queryActiveCourse: false, queryCurrentAccount: false
}) => {

  // get token from store
  const { 
    auth: { token1 }
  } = store.getState();

  // TODO: auto get access_token when expired 
  const token = store.getState().auth.access_token;

  const axiosConfig = axios.create({
    baseURL: baseUrl,
    headers: { 
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}` ,
      '2Scool-Active-Course': queryActiveCourse ? '1' : '0',
      '2Scool-Current-Account': queryCurrentAccount ? '1' : '0',},
    withCredentials: true,
  });

  // config axios interceptor;
  configHttpRequest(axiosConfig);
  configHttpResponse(axiosConfig);

  return axiosConfig;
};

export const baseUrl = 'http://10.0.2.2:5000'