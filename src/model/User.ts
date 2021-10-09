export namespace User {
    export interface IUser { [key: string]: any; }
    export interface LoginResponse {
      access_token: string;
      expires_in: number;
      refresh_token: string;
    }
    export interface LoginReqBody {
      username: string,
      password: string
    }
  
    export interface UpdateProfileReqBody {
      userName: string,
      email: string,
      name: string,
      surname: string,
      phoneNumber: string
    }
  
    export interface Login {
      username: string;
      password: string;
    }
  
    export interface UpdateProfile {
      userName: string;
      email: string;
      name: string;
      surname: string;
      phoneNumber: string;
    }
  
    export interface UserForSimpleListDto {
      userName: string;
      email: string;
      name: string;
      phoneNumber: string;
    }
  }