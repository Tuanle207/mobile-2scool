import { getApiService } from "./BaseApiService"

export const getUserInfo = async () => {
    const endpoint = `/api/identity/my-profile`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const logout = async () => {
    const endpoint = `/api/account/logout`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const endpoint = `/api/identity/my-profile/change-password`
    const param = {
        currentPassword: currentPassword,
        newPassword: newPassword
    }
    const axios = await getApiService()
    return axios.post(endpoint, param)
}