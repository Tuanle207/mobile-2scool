import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '../../../redux/store/store';
import { Util } from '../../../model/Util';
import * as AxiosLogger from 'axios-logger';
import { toUtcTime, toUtcTimeString } from '../../../ultil/TimeHelper';

const isDate = (value: any): boolean => {
  return typeof value === 'object' && typeof value.getMonth === 'function';
};

const instanceOfFilter = (obj: any): obj is Util.PagingFilter => {
  return typeof obj === 'object' && ['key', 'comparison', 'value'].every(key => key in obj) && Object.keys(obj).length === 3;
};

const isTimeKey = (key: string) => {
  const dateTimePropsTraits = ['Time', 'time', 'Date', 'date'];
  return dateTimePropsTraits.some(x => key.includes(x));
};

const convertToUtcTime = (config: AxiosRequestConfig) => {
  if (config.data === undefined || config.data === null) {
    return;
  }
  if (typeof config.data === 'string') {
    const data = JSON.parse(config.data);
    recursiveParseUtcTime(data);
    config.data = JSON.stringify(data);
  } else if (typeof config.data === 'object') {
    const { data } = config;
    recursiveParseUtcTime(data);
  }
};

const recursiveParseUtcTime = (obj: any): void => {
  if (!obj) {
    return;
  }

  if (instanceOfFilter(obj) && isTimeKey(obj.key) && typeof obj.value === 'string') {
    obj.value = toUtcTimeString(obj.value);
    return;
  }

  Object.keys(obj).forEach(prop => {
    if (typeof(obj[prop]) === 'string' && isTimeKey(prop)) {
      obj[prop] = toUtcTimeString(obj[prop]);
    } else if (isDate(obj[prop]) && isTimeKey(prop)) {
      obj[prop] = toUtcTime(obj[prop]);
    } else if (Array.isArray(obj[prop])) {
      obj[prop].forEach((item: string) => {
        recursiveParseUtcTime(item);
      });
    } else if (typeof obj[prop] === 'object') {
      recursiveParseUtcTime(obj[prop]);
    }
  });
};

export const configHttpRequest = (axios: AxiosInstance) => {
  const token = store.getState().auth.access_token;
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (config.headers) config.headers['Accept-Language'] = 'vi-vn';
    if (config.headers) config.headers['Authorization'] = `Bearer ${token}`;
    return AxiosLogger.requestLogger(config);
  });
};

export const configHttpResponse = (axios: AxiosInstance) => {
  axios.interceptors.response.use(function (response: AxiosResponse) {
    return response;
  });
};