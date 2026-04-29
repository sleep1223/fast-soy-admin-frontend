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

export const employeeStatusRecord: Record<Api.HrManage.EmployeeStatus, App.I18n.I18nKey> = {
  pending: 'page.hr.employee.status.pending',
  onboarding: 'page.hr.employee.status.onboarding',
  active: 'page.hr.employee.status.active',
  resigned: 'page.hr.employee.status.resigned'
};

export const employeeStatusOptions = transformRecordToOption(employeeStatusRecord);

export const employeeStatusTagType: Record<Api.HrManage.EmployeeStatus, NaiveUI.ThemeColor> = {
  pending: 'warning',
  onboarding: 'info',
  active: 'success',
  resigned: 'default'
};

/**
 * 员工状态机的下一个目标状态。
 * pending → onboarding → active → resigned；resigned 为终态。
 */
export const employeeNextStatus: Partial<Record<Api.HrManage.EmployeeStatus, Api.HrManage.EmployeeStatus>> = {
  pending: 'onboarding',
  onboarding: 'active',
  active: 'resigned'
};

export const employeeTransitionLabel: Partial<Record<Api.HrManage.EmployeeStatus, App.I18n.I18nKey>> = {
  pending: 'page.hr.employee.transition.toOnboarding',
  onboarding: 'page.hr.employee.transition.toActive',
  active: 'page.hr.employee.transition.toResigned'
};
