import { baseUrl, getApiService } from "./BaseApiService"

export const getClass = async () => {
    const endpoint = `/api/app/task-assigment/assigned-class-for-dcp-report?taskType=DcpReport`;
    const axios = await getApiService();
    return axios.get(endpoint);
};