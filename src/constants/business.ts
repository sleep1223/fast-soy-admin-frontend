import { transformRecordToOption } from '@/utils/common';

export const statusTypeRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.common.statusType.enable',
  '2': 'page.manage.common.statusType.disable'
};

export const statusTypeOptions = transformRecordToOption(statusTypeRecord);

export const apiMethodRecord: Record<Api.SystemManage.methods, App.I18n.I18nKey> = {
  get: 'page.manage.api.methods.GET',
  post: 'page.manage.api.methods.POST',
  put: 'page.manage.api.methods.PUT',
  patch: 'page.manage.api.methods.PATCH',
  delete: 'page.manage.api.methods.DELETE'
};

export const apiMethodOptions = transformRecordToOption(apiMethodRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gender.male',
  '2': 'page.manage.user.gender.female',
  '3': 'page.manage.user.gender.unknow'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.type.directory',
  '2': 'page.manage.menu.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);
