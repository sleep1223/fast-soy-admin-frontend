import { request } from '../request';

// ---- Employee ----
export function fetchGetEmployeeList(data?: Api.HrManage.EmployeeSearchParams) {
  return request<Api.HrManage.EmployeeList>({
    url: '/business/hr/employees/search',
    method: 'post',
    data: data ?? {}
  });
}

export function fetchGetEmployee(id: number) {
  return request<Api.HrManage.Employee>({
    url: `/business/hr/employees/${id}`,
    method: 'get'
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

/** employee state transition */
export function fetchTransitionEmployee(empId: number, data: Api.HrManage.EmployeeTransitionParams) {
  return request<null, 'json'>({
    url: `/business/hr/employees/${empId}/transition`,
    method: 'post',
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

// ---- Tag ----
export function fetchGetTagList(data?: Api.HrManage.TagSearchParams) {
  return request<Api.HrManage.TagList>({
    url: '/business/hr/tags/search',
    method: 'post',
    data: data ?? {}
  });
}

export function fetchAddTag(data?: Api.HrManage.TagAddParams) {
  return request<null, 'json'>({
    url: '/business/hr/tags',
    method: 'post',
    data
  });
}

export function fetchUpdateTag(data?: Api.HrManage.TagUpdateParams) {
  return request<null, 'json'>({
    url: `/business/hr/tags/${data?.id}`,
    method: 'patch',
    data
  });
}

export function fetchDeleteTag(data?: Api.HrManage.CommonDeleteParams) {
  return request<null>({
    url: `/business/hr/tags/${data?.id}`,
    method: 'delete'
  });
}

export function fetchBatchDeleteTag(data?: Api.HrManage.CommonBatchDeleteParams) {
  return request<null>({
    url: '/business/hr/tags',
    method: 'delete',
    data
  });
}

// ---- Dictionary Options ----
export function fetchGetDictOptions(dictType: string) {
  return request<Api.SystemManage.DictionaryOption[]>({
    url: `/system-manage/dictionaries/${dictType}/options`,
    method: 'get'
  });
}
