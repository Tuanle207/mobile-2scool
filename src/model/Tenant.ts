import { Util } from './Util';

export interface SingleTenantDto extends Util.IHaveExtraProperties {
  id: string;
  name: string;
}

export interface TenantDto {
  id: string;
  name: string;
  displayName: string;
  creationTime: Date;
}

export interface CreateTenantDto extends Util.IHaveExtraProperties {
  name: string;
  adminEmailAddress: string;
  adminPassword: string;
}

export interface UpdateTenantDto extends Util.IHaveExtraProperties {
  name: string;
}