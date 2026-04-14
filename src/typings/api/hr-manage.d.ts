declare namespace Api {
  namespace HrManage {
    type CommonDeleteParams = { id: number };
    type CommonBatchDeleteParams = { ids: number[] };
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    // ---- Employee ----
    type Employee = Common.CommonRecord<{
      name: string;
      employeeNo: string;
      email: string | null;
      phone: string | null;
      position: string | null;
      status: string;
      userId: number | null;
      departmentId: number;
      departmentName?: string;
      tagIds?: number[];
      tagNames?: string[];
    }>;

    type EmployeeAddParams = {
      userName: string;
      name: string;
      email: string;
      userGender?: string | null;
      departmentId?: number | null;
      tagIds?: number[] | null;
    };

    type EmployeeUpdateParams = { id?: number } & {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      position?: string | null;
      status?: string | null;
      tagIds?: number[] | null;
    };

    type EmployeeSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        status?: string;
        departmentId?: number;
      } & CommonSearchParams
    >;

    type EmployeeList = Common.PaginatingQueryRecord<Employee>;

    // ---- Department ----
    type Department = Common.CommonRecord<{
      name: string;
      code: string;
      description: string | null;
      managerId: number | null;
      status: string;
    }>;

    type DepartmentAddParams = {
      name: string;
      code: string;
      description?: string | null;
      managerId?: number | null;
      status?: string | null;
    };

    type DepartmentUpdateParams = { id?: number } & Partial<DepartmentAddParams>;

    type DepartmentSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        code?: string;
        status?: string;
      } & CommonSearchParams
    >;

    type DepartmentList = Common.PaginatingQueryRecord<Department>;

    type DepartmentStat = {
      id: number;
      name: string;
      code: string;
      managerName: string | null;
      employeeCount: number;
    };

    // ---- Tag ----
    type Tag = Common.CommonRecord<{
      name: string;
      category: string;
      description: string | null;
    }>;

    type TagAddParams = {
      name: string;
      category: string;
      description?: string | null;
    };

    type TagUpdateParams = { id?: number } & Partial<TagAddParams>;

    type TagSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        category?: string;
      } & CommonSearchParams
    >;

    type TagList = Common.PaginatingQueryRecord<Tag>;
  }
}
