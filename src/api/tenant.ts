import { TenantDto } from '../model/Tenant';
import { Util } from '../model/Util';
import { getApiService } from "./BaseApiService"


export const getTenantSimpleList = async () => {
    const endpoint = `/api/app/multitenancy/simple-list`
    const axios = await getApiService()
    return axios.get<Util.PagingModel<TenantDto>>(endpoint);
}