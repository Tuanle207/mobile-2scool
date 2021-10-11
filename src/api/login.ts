import axios from "axios";
import { User } from "../model/User";
import { baseUrl } from "./BaseApiService";

export const login = async (body: User.Login) => {
  const params = new URLSearchParams();
  params.append('client_id', 'Scool_App');
  params.append('client_secret', '1q2w3e*');
  params.append('grant_type', 'password');
  params.append('scope', 'offline_access openid profile role email phone Scool');
  params.append('password', body.password);
  params.append('username', body.username);

  const ins = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return ins.post('/connect/token', params);
};