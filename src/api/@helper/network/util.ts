import { Util } from '../../../model/Util';

export const parseQueryString = (params: Util.IObject = {}) => {
  return Object.keys(params).reduce((queryStr, current, index) => {
    const head = index === 0 ? '?' : `${queryStr}&`;
    return `${head}${current}=${params[current]}`;
  }, '');
};

export class HttpException<T = any> {
  statusCode?: number;
  message?: string;
  data?: T;

  constructor(message?: string, statusCode?: number, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
