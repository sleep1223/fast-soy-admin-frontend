import { localStg, sessionStg } from '@/utils/storage';

/**
 * Token 存储策略：
 * - 勾选"记住我"：access token 与 refresh token 都写入 localStorage，关浏览器后仍保留。
 * - 未勾选："只把 access token 写入 sessionStorage，不持久化 refresh token。
 *   关闭标签页后 sessionStorage 自动清空；access token 自然过期且无法续签 → 强制重新登录。
 *
 * 当前 token 所在的 storage 即"记住我"状态的事实来源（不再单独维护标志位）。
 */

/** Get token (localStorage first, fall back to sessionStorage) */
export function getToken() {
  return localStg.get('token') || sessionStg.get('token') || '';
}

/** Get refresh token (only persisted when remember-me is on) */
export function getRefreshToken() {
  return localStg.get('refreshToken') || sessionStg.get('refreshToken') || '';
}

/** Whether the current session is in "remember me" mode */
export function isRemembered() {
  return Boolean(localStg.get('token'));
}

/** Persist new tokens. If `remember`, use localStorage; otherwise sessionStorage and skip refresh token. */
export function setLoginTokens(token: string, refreshToken: string, remember: boolean) {
  // wipe both storages first to avoid mixed state
  localStg.remove('token');
  localStg.remove('refreshToken');
  sessionStg.remove('token');
  sessionStg.remove('refreshToken');

  if (remember) {
    localStg.set('token', token);
    localStg.set('refreshToken', refreshToken);
  } else {
    sessionStg.set('token', token);
    // intentionally drop refreshToken so the session cannot outlive the tab
  }
}

/** Update tokens after refresh while preserving the current remember-me mode. */
export function updateTokensPreservingMode(token: string, refreshToken: string) {
  setLoginTokens(token, refreshToken, isRemembered());
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  sessionStg.remove('token');
  sessionStg.remove('refreshToken');
  clearOriginalToken();
}

/** Save original admin tokens before impersonation (follows current remember-me mode) */
export function setOriginalToken(token: string, refreshToken: string) {
  if (isRemembered()) {
    localStg.set('originalToken', token);
    localStg.set('originalRefreshToken', refreshToken);
  } else {
    sessionStg.set('originalToken', token);
    sessionStg.set('originalRefreshToken', refreshToken);
  }
}

/** Get saved original admin tokens */
export function getOriginalToken() {
  return {
    token: localStg.get('originalToken') || sessionStg.get('originalToken') || '',
    refreshToken: localStg.get('originalRefreshToken') || sessionStg.get('originalRefreshToken') || ''
  };
}

/** Clear original tokens after exiting impersonation */
export function clearOriginalToken() {
  localStg.remove('originalToken');
  localStg.remove('originalRefreshToken');
  sessionStg.remove('originalToken');
  sessionStg.remove('originalRefreshToken');
}
