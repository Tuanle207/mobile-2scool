import { DcpReport } from "../redux/reducer/mistake"
import { getApiService } from "./BaseApiService"

export const getCriteria = async () => {
    const endpoint = `/api/app/criteria/simple-list`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const getRegulation = async () => {
    const endpoint = `/api/app/regulation/simple-list`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const getStudent = async (classId: string) => {
    const endpoint = `/api/app/classes/${classId}`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const postDcpReport = async (params: DcpReport) => {
    const endpoint = `api/app/dcp-reports`
    const axios = await getApiService()
    return axios.post(endpoint, params)
}

export const getAllDcpReports = async (input: any) => {
    try {
        const endpoint = `api/app/dcp-reports/get-my-reports`
        const apiService = await getApiService();
        const result = await apiService.post(endpoint, input)
        return result;
    } catch (error) {
        throw error;
    }
};
export const delDcpReportsId = async (id: any) => {
    try {
        const endpoint = `api/app/dcp-reports/${id}`
        const apiService = await getApiService();
        const result = await apiService.delete(endpoint)
        return result;
    } catch (error) {
        throw error;
    }
};
export const getAllLrReports = async (input: any) => {
    try {
        const endpoint = `api/app/lr-report/get-my-reports`
        const apiService = await getApiService();
        const result = await apiService.post(endpoint, input)
        return result;
    } catch (error) {
        throw error;
    }
};