export type Token = {
    access_token: string,
    token_type: string, 
    refresh_token: string,
    expires_in?: string,
    scope?: string
}

export function loginSuccess (payload: Token) {
    return {
        type: 'LOGIN_SUCCESS',
        payload: payload
    }
}