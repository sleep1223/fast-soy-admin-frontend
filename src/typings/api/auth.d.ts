declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      nickName: string;
      roles: string[];
      buttons: string[];
      /** Whether the current session is an impersonation */
      impersonating?: boolean;
      /** The original admin user id who initiated impersonation */
      impersonatorId?: number;
    }
  }
}
