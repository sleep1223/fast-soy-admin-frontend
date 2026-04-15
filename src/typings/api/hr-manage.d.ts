declare namespace Api {
  namespace HrManage {
    type CommonDeleteParams = { id: string };
    type CommonBatchDeleteParams = { ids: string[] };
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    // ---- Employee ----
    type Employee = Common.CommonRecord<{
      name: string;
      employeeNo: string;
      email: string | null;
      phone: string | null;
      position: string | null;
      status: string;
      userId: string | null;
      departmentId: string;
      departmentName?: string;
      tagIds?: string[];
      tagNames?: string[];
    }>;

    type EmployeeAddParams = {
      userName: string;
      name: string;
      email: string;
      userGender?: string | null;
      departmentId?: string | null;
      tagIds?: string[] | null;
    };

    type EmployeeUpdateParams = { id?: string } & {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      position?: string | null;
      status?: string | null;
      tagIds?: string[] | null;
    };

    type EmployeeSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        status?: string;
        departmentId?: string;
      } & CommonSearchParams
    >;

    type EmployeeList = Common.PaginatingQueryRecord<Employee>;

    /**
     * employee state transition target
     *
     * - `pending`: 待入职
     * - `onboarding`: 入职中
     * - `active`: 在职
     * - `resigned`: 已离职
     */
    type EmployeeTransitionState = 'pending' | 'onboarding' | 'active' | 'resigned';

    type EmployeeTransitionParams = {
      toState: EmployeeTransitionState;
    };

    // ---- Department ----
    type Department = Common.CommonRecord<{
      name: string;
      code: string;
      description: string | null;
      managerId: string | null;
      status: string;
    }>;

    type DepartmentAddParams = {
      name: string;
      code: string;
      description?: string | null;
      managerId?: string | null;
      status?: string | null;
    };

    type DepartmentUpdateParams = { id?: string } & Partial<DepartmentAddParams>;

    type DepartmentSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        code?: string;
        status?: string;
      } & CommonSearchParams
    >;

    type DepartmentList = Common.PaginatingQueryRecord<Department>;

    type DepartmentStat = {
      id: string;
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

    type TagUpdateParams = { id?: string } & Partial<TagAddParams>;

    type TagSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        category?: string;
      } & CommonSearchParams
    >;

    type TagList = Common.PaginatingQueryRecord<Tag>;
  }
}
