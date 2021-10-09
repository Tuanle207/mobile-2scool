import axios from "axios"
import { baseUrl } from "./BaseApiService"

export const getClass = (token: string) => {
    const url = `${baseUrl}/api/app/task-assigment/assigned-class-for-dcp-report?taskType=DcpReport`
    console.log('token', token)
    const header = {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkQ5QzlGRkZFOUMyOTI0RDM3ODg0MjlFOTIzQ0VERkM2IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MzM3MDU3MDAsImV4cCI6MTY2NTI0MTcwMCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjoiU2Nvb2wiLCJjbGllbnRfaWQiOiJTY29vbF9BcHAiLCJzdWIiOiI0ZmIwZTZjMC0xMmY0LTc2ODUtMjY4Yy0zOWZmNjMwOTQ2NGQiLCJhdXRoX3RpbWUiOjE2MzM3MDU3MDAsImlkcCI6ImxvY2FsIiwicm9sZSI6WyJD4budIMSR4buPIiwiR2nhu68gc-G7lSDEkeG6p3UgYsOgaSJdLCJwaG9uZV9udW1iZXIiOiIwOTk5ODg3Nzc2IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiRmFsc2UiLCJlbWFpbCI6ImxhbGFsYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwibmFtZSI6ImxhbGFsYTEyMyIsImlhdCI6MTYzMzcwNTcwMCwic2NvcGUiOlsiU2Nvb2wiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.YutvQjyJgofqGdjS4ToBLLRJ-5NDYX0lISE_Fk0XHhvdPNNdoviIiKvJ6e29IKBiYMkUiIBVV1jQOpP957OCINBaTnW1Jlfl_ksoFsiW7x-RIDhTdWxBBboLxxz_SuOnq99y5wpwwHkxLuhavJzWyxl0SMw8v__igt0Zn0Vy4GxUVbkDdATboozRrEXQcbX2LjemBFD-aCz8EJOEeawopLQ9o6LdvwDRCpV4S8NfrF8vDsmZAS1aUvMZlU31PX4_ubNj3PtAwBmvkDKOrqXop4HciyL-INBKw1RE1o1NTyTx8J4Zq5Ii-GHlQPxv5l_jWlk41z_xw4uuf5vaf4rD-A`
        }
    }
    return axios.get(url, header)
}