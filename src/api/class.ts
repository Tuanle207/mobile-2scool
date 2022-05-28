import { baseUrl, getApiService } from "./BaseApiService"

export const getClass = async () => {
    const endpoint = `/api/app/task-assigment/assigned-class-for-dcp-report?taskType=DcpReport`;
    const axios = await getApiService({ queryActiveCourse: true, queryCurrentAccount: true });
    return axios.get(endpoint);
};

export const getClassLrReport = async () => {
    const endpoint = `/api/app/task-assigment/assigned-class-for-dcp-report?taskType=LessonRegisterReport`;
    const axios = await getApiService({ queryActiveCourse: true, queryCurrentAccount: true });
    return axios.get(endpoint);
};