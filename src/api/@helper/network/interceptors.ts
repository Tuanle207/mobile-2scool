import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export const configHttpRequest = (axios: AxiosInstance) => {
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (config.headers) config.headers['Accept-Language'] = 'vi-vn';
    if (config.headers) config.headers['Authorization'] = `Bearer ${''}`;
    return config;
  });
};

export const configHttpResponse = (axios: AxiosInstance) => {
  axios.interceptors.response.use(function (response: AxiosResponse) {
    return response;
  });
};