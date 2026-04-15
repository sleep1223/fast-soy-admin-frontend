import { request } from '../request';

/** get role list */
export function fetchGetRoleList(data?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/system-manage/roles/search',
    method: 'post',
    data: data ?? {}
  });
}

/** get user list */
export function fetchGetUserList(data?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system-manage/users/search',
    method: 'post',
    data: data ?? {}
  });
}

/** get menu list */
export function fetchGetMenuList(data?: Api.SystemManage.MenuSearchParams) {
  return request<Api.SystemManage.MenuList>({
    url: '/system-manage/menus/search',
    method: 'post',
    data: data ?? {}
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<{ [key: string]: string }[]>({
    url: '/system-manage/menus/pages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/system-manage/menus/tree',
    method: 'get'
  });
}

/** get menu button tree */
export function fetchGetMenuButtonTree() {
  return request<Api.SystemManage.ButtonTree[]>({
    url: '/system-manage/menus/buttons/tree',
    method: 'get'
  });
}

/** get api tree */
export function fetchGetApiTree() {
  return request<Api.SystemManage.ApiTree[]>({
    url: '/system-manage/apis/tree',
    method: 'get'
  });
}

/** refresh api from fastapi */
export function fetchRefreshAPI() {
  return request({
    url: '/system-manage/apis/refresh',
    method: 'post'
  });
}

/** get api tags */
export function fetchGetApiTagsList() {
  return request({
    url: '/system-manage/apis/tags',
    method: 'get'
  });
}

/** get api list */
export function fetchGetApiList(data?: Api.SystemManage.ApiSearchParams) {
  return request<Api.SystemManage.ApiList>({
    url: '/system-manage/apis/search',
    method: 'post',
    data: data ?? {}
  });
}

/** add api */
export function fetchAddApi(data?: Api.SystemManage.ApiAddParams) {
  return request<Api.SystemManage.ApiList, 'json'>({
    url: '/system-manage/apis',
    method: 'post',
    data
  });
}

/** delete api */
export function fetchDeleteApi(data?: Api.SystemManage.CommonDeleteParams) {
  return request<Api.SystemManage.ApiList>({
    url: `/system-manage/apis/${data?.id}`,
    method: 'delete'
  });
}

/** batch delete api */
export function fetchBatchDeleteApi(data?: Api.SystemManage.CommonBatchDeleteParams) {
  return request<Api.SystemManage.ApiList>({
    url: '/system-manage/apis',
    method: 'delete',
    data: { ids: data?.ids }
  });
}

/** update api */
export function fetchUpdateApi(data?: Api.SystemManage.ApiUpdateParams) {
  return request<Api.SystemManage.ApiList, 'json'>({
    url: `/system-manage/apis/${data?.id}`,
    method: 'patch',
    data
  });
}

/** add user */
export function fetchAddUser(data?: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.UserList, 'json'>({
    url: '/system-manage/users',
    method: 'post',
    data
  });
}

/** update user */
export function fetchUpdateUser(data?: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.UserList, 'json'>({
    url: `/system-manage/users/${data?.id}`,
    method: 'patch',
    data
  });
}

/** delete user */
export function fetchDeleteUser(data?: Api.SystemManage.CommonDeleteParams) {
  return request<Api.SystemManage.UserList>({
    url: `/system-manage/users/${data?.id}`,
    method: 'delete'
  });
}

/** batch delete user */
export function fetchBatchDeleteUser(data?: Api.SystemManage.CommonBatchDeleteParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system-manage/users',
    method: 'delete',
    data: { ids: data?.ids }
  });
}

/** offline user */
export function fetchUserOffline(userId: string) {
  return request({
    url: `/system-manage/users/${userId}/offline`,
    method: 'post'
  });
}

/** batch offline users by ids */
export function fetchBatchUserOffline(data: Api.SystemManage.CommonBatchDeleteParams) {
  return request({
    url: '/system-manage/users/batch-offline',
    method: 'post',
    data
  });
}

/** offline users by role codes */
export function fetchOfflineUsersByRole(data: { roleCodes: string[] }) {
  return request({
    url: '/system-manage/users/offline-by-role',
    method: 'post',
    data
  });
}

/** add role */
export function fetchAddRole(data?: Api.SystemManage.RoleUpdateParams) {
  return request<Api.SystemManage.RoleList, 'json'>({
    url: '/system-manage/roles',
    method: 'post',
    data
  });
}

/** delete role */
export function fetchDeleteRole(data?: Api.SystemManage.CommonDeleteParams) {
  return request<Api.SystemManage.RoleList>({
    url: `/system-manage/roles/${data?.id}`,
    method: 'delete'
  });
}

/** batch delete role */
export function fetchBatchDeleteRole(data?: Api.SystemManage.CommonBatchDeleteParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/system-manage/roles',
    method: 'delete',
    data: { ids: data?.ids }
  });
}

/** update role */
export function fetchUpdateRole(data?: Api.SystemManage.RoleUpdateParams) {
  return request<Api.SystemManage.RoleList, 'json'>({
    url: `/system-manage/roles/${data?.id}`,
    method: 'patch',
    data
  });
}

/** get role menu ids */
export function fetchGetRoleMenu(data?: Api.SystemManage.RoleAuthorizedParams) {
  return request<Api.SystemManage.RoleAuthorizedList>({
    url: `/system-manage/roles/${data?.id}/menus`,
    method: 'get'
  });
}

/** update role menu ids */
export function fetchUpdateRoleMenu(data?: Api.SystemManage.RoleAuthorizedList) {
  return request<Api.SystemManage.RoleAuthorizedList>({
    url: `/system-manage/roles/${data?.id}/menus`,
    method: 'patch',
    data
  });
}

/** get role button ids */
export function fetchGetRoleButton(data?: Api.SystemManage.RoleAuthorizedParams) {
  return request<Api.SystemManage.RoleAuthorizedList>({
    url: `/system-manage/roles/${data?.id}/buttons`,
    method: 'get'
  });
}

/** update role button ids */
export function fetchUpdateRoleButton(data?: Api.SystemManage.RoleAuthorizedList) {
  return request<Api.SystemManage.RoleAuthorizedList>({
    url: `/system-manage/roles/${data?.id}/buttons`,
    method: 'patch',
    data
  });
}

/** get role api ids */
export function fetchGetRoleApi(data?: Api.SystemManage.RoleAuthorizedParams) {
  return request<Api.SystemManage.RoleAuthorizedList>({
    url: `/system-manage/roles/${data?.id}/apis`,
    method: 'get'
  });
}

/** update role api ids */
export function fetchUpdateRoleApi(data?: Api.SystemManage.RoleAuthorizedList) {
  return request<Api.SystemManage.RoleAuthorizedList>({
    url: `/system-manage/roles/${data?.id}/apis`,
    method: 'patch',
    data
  });
}

/** add menu */
export function fetchAddMenu(data?: Api.SystemManage.MenuAddParams) {
  return request<Api.SystemManage.MenuList, 'json'>({
    url: '/system-manage/menus',
    method: 'post',
    data
  });
}

/** delete menu */
export function fetchDeleteMenu(data?: Api.SystemManage.CommonDeleteParams) {
  return request<Api.SystemManage.MenuList>({
    url: `/system-manage/menus/${data?.id}`,
    method: 'delete'
  });
}

/** batch delete menu */
export function fetchBatchDeleteMenu(data?: Api.SystemManage.CommonBatchDeleteParams) {
  return request<Api.SystemManage.MenuList>({
    url: '/system-manage/menus',
    method: 'delete',
    data: { ids: data?.ids }
  });
}

/** update menu */
export function fetchUpdateMenu(data?: Api.SystemManage.MenuUpdateParams) {
  return request<Api.SystemManage.MenuList, 'json'>({
    url: `/system-manage/menus/${data?.id}`,
    method: 'patch',
    data
  });
}

/** get dictionary list */
export function fetchGetDictionaryList(data?: Api.SystemManage.DictionarySearchParams) {
  return request<Api.SystemManage.DictionaryList>({
    url: '/system-manage/dictionaries/search',
    method: 'post',
    data: data ?? {}
  });
}

/** get dictionary detail */
export function fetchGetDictionary(id: string) {
  return request<Api.SystemManage.Dictionary>({
    url: `/system-manage/dictionaries/${id}`,
    method: 'get'
  });
}

/** add dictionary */
export function fetchAddDictionary(data?: Api.SystemManage.DictionaryAddParams) {
  return request<null, 'json'>({
    url: '/system-manage/dictionaries',
    method: 'post',
    data
  });
}

/** update dictionary */
export function fetchUpdateDictionary(data?: Api.SystemManage.DictionaryUpdateParams) {
  return request<null, 'json'>({
    url: `/system-manage/dictionaries/${data?.id}`,
    method: 'patch',
    data
  });
}

/** delete dictionary */
export function fetchDeleteDictionary(data?: Api.SystemManage.CommonDeleteParams) {
  return request<null>({
    url: `/system-manage/dictionaries/${data?.id}`,
    method: 'delete'
  });
}

/** batch delete dictionary */
export function fetchBatchDeleteDictionary(data?: Api.SystemManage.CommonBatchDeleteParams) {
  return request<null>({
    url: '/system-manage/dictionaries',
    method: 'delete',
    data: { ids: data?.ids }
  });
}
