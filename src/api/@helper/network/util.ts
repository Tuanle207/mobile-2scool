import { Util } from '../../interfaces';

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

export const isTokenValid = (token: string): boolean => {
  if (!token) {
    return false;
  }
  try {
    const decoded: JwtPayload = jwt_decode(token);    if (!decoded || typeof(decoded) !== 'object' || !decoded.exp) {
      return false;
    }
    const now = new Date().valueOf();
    return now/1000 < decoded.exp;
  } catch (err) {
    console.log('invalid')
    return false;
  }
};