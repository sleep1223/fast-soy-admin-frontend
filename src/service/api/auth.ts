import { request } from '../request';

/**
 * login
 *
 * @param userName user name
 * @param password password
 */
export function fetchLogin(userName: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}

/** get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/user-info' });
}

/**
 * refresh token
 *
 * @param refreshToken refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refresh-token',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/** send captcha code */
export function fetchSendCaptcha(phone: string) {
  return request<null>({
    url: '/auth/captcha',
    method: 'post',
    data: { phone }
  });
}

/** login by captcha code */
export function fetchCodeLogin(phone: string, code: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/code-login',
    method: 'post',
    data: { phone, code }
  });
}

/** register */
export function fetchRegister(data: { phone: string; code: string; password: string; userName?: string }) {
  return request<null>({
    url: '/auth/register',
    method: 'post',
    data
  });
}
