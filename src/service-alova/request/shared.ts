import { useAuthStore } from '@/store/modules/auth';
import { getRefreshToken, getToken, updateTokensPreservingMode } from '@/store/modules/auth/shared';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = getToken();
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** refresh token */
export async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const rToken = getRefreshToken();
  // No refresh token (non-remember session) — cannot renew, force logout.
  if (!rToken) {
    resetStore();
    throw new Error('No refresh token available');
  }

  const refreshTokenMethod = fetchRefreshToken(rToken);

  // set the refreshToken role, so that the request will not be intercepted
  refreshTokenMethod.meta.authRole = 'refreshToken';

  try {
    const data = await refreshTokenMethod;
    updateTokensPreservingMode(data.token, data.refreshToken);
  } catch (error) {
    resetStore();
    throw error;
  }
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
