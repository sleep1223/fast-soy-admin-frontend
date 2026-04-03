import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { fetchGetUserInfo, fetchImpersonate, fetchLogin } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken, getOriginalToken, setOriginalToken, clearOriginalToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref('');
  const impersonating = ref(Boolean(getOriginalToken().token));

  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    nickName: '',
    roles: [],
    buttons: []
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    recordUserId();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  function checkTabClear(): boolean {
    if (!userInfo.userId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (!lastLoginUserId || lastLoginUserId !== userInfo.userId) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();

      localStg.remove('lastLoginUserId');
      return true;
    }

    localStg.remove('lastLoginUserId');
    return false;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        // Check if the tab needs to be cleared
        const isClear = checkTabClear();
        let needRedirect = redirect;

        if (isClear) {
          // If the tab needs to be cleared,it means we don't need to redirect.
          needRedirect = false;
        }
        await redirectFromLogin(needRedirect);

        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          content: $t('page.login.common.welcomeBack', { nickName: userInfo.nickName }),
          duration: 4500
        });
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // update store
      Object.assign(userInfo, info);

      // sync impersonation state from backend
      impersonating.value = Boolean(info.impersonating);

      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const maybeToken = getToken();

    if (maybeToken) {
      token.value = maybeToken;
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  /**
   * Impersonate a user (admin only)
   *
   * @param userId Target user id
   */
  async function impersonate(userId: number) {
    const { data: loginToken, error } = await fetchImpersonate(userId);

    if (!error) {
      // Only save original tokens if not already impersonating (prevent chain overwrite)
      if (!impersonating.value) {
        const currentToken = localStg.get('token') || '';
        const currentRefreshToken = localStg.get('refreshToken') || '';
        setOriginalToken(currentToken, currentRefreshToken);
      }

      const pass = await loginByToken(loginToken);

      if (pass) {
        impersonating.value = true;
        tabStore.initTabStore(route);
        await routeStore.initAuthRoute();

        window.$notification?.warning({
          title: $t('page.manage.user.impersonate.switchSuccess'),
          content: $t('page.manage.user.impersonate.nowActingAs', { name: userInfo.nickName || userInfo.userName }),
          duration: 4500
        });

        return true;
      }
    }

    return false;
  }

  /** Exit impersonation and restore original admin session */
  async function exitImpersonate() {
    const originalToken = getOriginalToken();

    if (!originalToken.token) {
      return false;
    }

    // Restore original tokens
    const pass = await loginByToken({
      token: originalToken.token,
      refreshToken: originalToken.refreshToken
    });

    // Always clear impersonation state, even if loginByToken fails (token expired)
    clearOriginalToken();
    impersonating.value = false;

    if (pass) {
      tabStore.initTabStore(route);
      await routeStore.initAuthRoute();

      window.$notification?.success({
        title: $t('page.manage.user.impersonate.exitSuccess'),
        duration: 3000
      });

      return true;
    }

    // Original token expired — force full logout
    await resetStore();
    return false;
  }

  return {
    token,
    userInfo,
    impersonating,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    loginByToken,
    initUserInfo,
    impersonate,
    exitImpersonate
  };
});
