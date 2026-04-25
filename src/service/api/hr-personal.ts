import { request } from '../request';

// ---- My Workspace (employee self-service) ----

export function fetchMyProfile() {
  return request<Api.HrPersonal.MyProfile>({
    url: '/business/hr/my/profile',
    method: 'get'
  });
}

export function fetchUpdateMyProfile(data: Api.HrPersonal.MyProfileUpdateParams) {
  return request<null, 'json'>({
    url: '/business/hr/my/profile',
    method: 'patch',
    data
  });
}

export function fetchUpdateMyTags(tagIds: string[]) {
  return request<null, 'json'>({
    url: '/business/hr/my/tags',
    method: 'patch',
    data: { tagIds }
  });
}

export function fetchMyDepartment() {
  return request<Api.HrPersonal.Colleague[]>({
    url: '/business/hr/my/department',
    method: 'get'
  });
}

export function fetchUploadMyAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<{ avatarUrl: string }>({
    url: '/business/hr/my/avatar',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// ---- My Team (manager) ----

export function fetchTeamEmployees(data?: Api.HrManage.EmployeeSearchParams) {
  return request<Api.HrManage.EmployeeList>({
    url: '/business/hr/team/employees/search',
    method: 'post',
    data: data ?? {}
  });
}

export function fetchTeamStats() {
  return request<Api.HrPersonal.TeamStats>({
    url: '/business/hr/team/stats',
    method: 'get'
  });
}

export function fetchAddTeamEmployee(data: Api.HrManage.EmployeeAddParams) {
  return request<null, 'json'>({
    url: '/business/hr/team/employees',
    method: 'post',
    data
  });
}

export function fetchUpdateTeamEmployee(data: Api.HrManage.EmployeeUpdateParams) {
  return request<null, 'json'>({
    url: `/business/hr/team/employees/${data.id}`,
    method: 'patch',
    data
  });
}

export function fetchUpdateSubordinateTags(empId: string, tagIds: string[]) {
  return request<null, 'json'>({
    url: `/business/hr/team/employees/${empId}/tags`,
    method: 'patch',
    data: { tagIds }
  });
}

export function fetchTransitionTeamEmployee(empId: string, data: Api.HrManage.EmployeeTransitionParams) {
  return request<null, 'json'>({
    url: `/business/hr/team/employees/${empId}/transition`,
    method: 'post',
    data
  });
}
