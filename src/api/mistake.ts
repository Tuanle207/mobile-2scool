import { DcpReport } from "../redux/reducer/mistake"
import { getApiService } from "./BaseApiService"
import { getApiServiceFormData } from "./BaseApiServiceFormData.ts"

export const getCriteria = async () => {
    const endpoint = `/api/app/criteria/simple-list`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const getRegulation = async () => {
    const endpoint = `/api/app/regulation/simple-list`
    const axios = await getApiService({ queryActiveCourse: true })
    return axios.get(endpoint)
}

export const getStudent = async (classId: string) => {
    const endpoint = `/api/app/classes/${classId}`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const postDcpReport = async (params: DcpReport) => {
    const endpoint = `api/app/dcp-reports`
    const axios = await getApiService({ queryCurrentAccount: true })
    return axios.post(endpoint, params)
}

export const getAllDcpReports = async (input: any) => {
    try {
        const endpoint = `api/app/dcp-reports/get-my-reports`
        const apiService = await getApiService({ queryActiveCourse: true, queryCurrentAccount: true });
        const result = await apiService.post(endpoint, input)
        return result;
    } catch (error) {
        throw error;
    }
};
export const delDcpReportsId = async (id: any) => {
    try {
        const endpoint = `api/app/dcp-reports/${id}`
        const apiService = await getApiService({ queryCurrentAccount: true });
        const result = await apiService.delete(endpoint)
        return result;
    } catch (error) {
        throw error;
    }
};
export const getAllLrReports = async (input: any) => {
    try {
        const endpoint = `api/app/lr-report/get-my-reports`
        const apiService = await getApiService({ queryCurrentAccount: true });
        const result = await apiService.post(endpoint, input)
        return result;
    } catch (error) {
        throw error;
    }
};
export const postCreateLrReports = async (body: any) => {
    try {
        const endpoint = `api/app/lr-report`
        const apiService = await getApiServiceFormData({ queryCurrentAccount: true });
        const result = await apiService.post(endpoint, body)
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const delLrpReportsId = async (id: any) => {
    try {
        const endpoint = `api/app/lr-report/${id}`
        const apiService = await getApiService({ queryCurrentAccount: true });
        const result = await apiService.delete(endpoint)
        return result;
    } catch (error) {
        throw error;
    }
};
export const postUpdateLrReports = async (body: any, id:string) => {
    try {
        const endpoint = `api/app/lr-report/${id}`
        const apiService = await getApiServiceFormData();
        const result = await apiService.put(endpoint, body)
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const putEditDcpReport = async (params: DcpReport, id:string) => {
    const endpoint = `api/app/dcp-reports/${id}`
    const axios = await getApiService()
    return axios.put(endpoint, params)
};
export const getMyDcpReportId = async (id:String) => {
    const endpoint = `api/app/dcp-reports/${id}`
    const axios = await getApiService()
    return axios.get(endpoint)
};
