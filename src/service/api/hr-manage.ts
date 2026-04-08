import { request } from '../request';

// ---- Employee ----
export function fetchGetEmployeeList(data?: Api.HrManage.EmployeeSearchParams) {
  return request<Api.HrManage.EmployeeList>({
    url: '/business/hr/employees/search',
    method: 'post',
    data: data ?? {}
  });
}

export function fetchAddEmployee(data?: Api.HrManage.EmployeeAddParams) {
  return request<null, 'json'>({
    url: '/business/hr/employees',
    method: 'post',
    data
  });
}

export function fetchUpdateEmployee(data?: Api.HrManage.EmployeeUpdateParams) {
  return request<null, 'json'>({
    url: `/business/hr/employees/${data?.id}`,
    method: 'patch',
    data
  });
}

export function fetchDeleteEmployee(data?: Api.HrManage.CommonDeleteParams) {
  return request<null>({
    url: `/business/hr/employees/${data?.id}`,
    method: 'delete'
  });
}

export function fetchBatchDeleteEmployee(data?: Api.HrManage.CommonBatchDeleteParams) {
  return request<null>({
    url: '/business/hr/employees',
    method: 'delete',
    data
  });
}

// ---- Department ----
export function fetchGetDepartmentList(data?: Api.HrManage.DepartmentSearchParams) {
  return request<Api.HrManage.DepartmentList>({
    url: '/business/hr/departments/search',
    method: 'post',
    data: data ?? {}
  });
}

export function fetchGetDepartmentStats() {
  return request<Api.HrManage.DepartmentStat[]>({
    url: '/business/hr/departments/stats',
    method: 'get'
  });
}

export function fetchAddDepartment(data?: Api.HrManage.DepartmentAddParams) {
  return request<null, 'json'>({
    url: '/business/hr/departments',
    method: 'post',
    data
  });
}

export function fetchUpdateDepartment(data?: Api.HrManage.DepartmentUpdateParams) {
  return request<null, 'json'>({
    url: `/business/hr/departments/${data?.id}`,
    method: 'patch',
    data
  });
}

export function fetchDeleteDepartment(data?: Api.HrManage.CommonDeleteParams) {
  return request<null>({
    url: `/business/hr/departments/${data?.id}`,
    method: 'delete'
  });
}

export function fetchBatchDeleteDepartment(data?: Api.HrManage.CommonBatchDeleteParams) {
  return request<null>({
    url: '/business/hr/departments',
    method: 'delete',
    data
  });
}

// ---- Skill ----
export function fetchGetSkillList(data?: Api.HrManage.SkillSearchParams) {
  return request<Api.HrManage.SkillList>({
    url: '/business/hr/skills/search',
    method: 'post',
    data: data ?? {}
  });
}

export function fetchAddSkill(data?: Api.HrManage.SkillAddParams) {
  return request<null, 'json'>({
    url: '/business/hr/skills',
    method: 'post',
    data
  });
}

export function fetchUpdateSkill(data?: Api.HrManage.SkillUpdateParams) {
  return request<null, 'json'>({
    url: `/business/hr/skills/${data?.id}`,
    method: 'patch',
    data
  });
}

export function fetchDeleteSkill(data?: Api.HrManage.CommonDeleteParams) {
  return request<null>({
    url: `/business/hr/skills/${data?.id}`,
    method: 'delete'
  });
}

export function fetchBatchDeleteSkill(data?: Api.HrManage.CommonBatchDeleteParams) {
  return request<null>({
    url: '/business/hr/skills',
    method: 'delete',
    data
  });
}
