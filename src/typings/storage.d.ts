/** The storage namespace */
declare namespace StorageType {
  interface Session {
    /** The theme color */
    themeColor: string;
    /** The token (used when "remember me" is unchecked — cleared on tab/window close) */
    token: string;
    /** The refresh token (only present when impersonating in non-remember mode) */
    refreshToken: string;
    /** Original admin token saved during impersonation (non-remember mode) */
    originalToken: string;
    /** Original admin refresh token saved during impersonation (non-remember mode) */
    originalRefreshToken: string;
    // /**
    //  * the theme settings
    //  */
    // themeSettings: App.Theme.ThemeSetting;
  }

  interface Local {
    /** The i18n language */
    lang: App.I18n.LangType;
    /** The token */
    token: string;
    /** Fixed sider with mix-menu */
    mixSiderFixed: CommonType.YesOrNo;
    /** The refresh token */
    refreshToken: string;
    /** The theme color */
    themeColor: string;
    /** The dark mode */
    darkMode: boolean;
    /** The theme settings */
    themeSettings: App.Theme.ThemeSetting;
    /**
     * The override theme flags
     *
     * The value is the build time of the project
     */
    overrideThemeFlag: string;
    /** The global tabs */
    globalTabs: App.Global.Tab[];
    /** The backup theme setting before is mobile */
    backupThemeSettingBeforeIsMobile: {
      layout: UnionKey.ThemeLayoutMode;
      siderCollapse: boolean;
    };
    /** The last login user id */
    lastLoginUserId: string;
    /** The original admin token saved during impersonation */
    originalToken: string;
    /** The original admin refresh token saved during impersonation */
    originalRefreshToken: string;
  }
}
