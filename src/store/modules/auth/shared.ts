import { localStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('token') || '';
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  clearOriginalToken();
}

/** Save original admin tokens before impersonation */
export function setOriginalToken(token: string, refreshToken: string) {
  localStg.set('originalToken', token);
  localStg.set('originalRefreshToken', refreshToken);
}

/** Get saved original admin tokens */
export function getOriginalToken() {
  return {
    token: localStg.get('originalToken') || '',
    refreshToken: localStg.get('originalRefreshToken') || ''
  };
}

/** Clear original tokens after exiting impersonation */
export function clearOriginalToken() {
  localStg.remove('originalToken');
  localStg.remove('originalRefreshToken');
}
