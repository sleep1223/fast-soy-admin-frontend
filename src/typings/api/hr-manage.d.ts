declare namespace Api {
  namespace HrManage {
    type CommonDeleteParams = { id: string };
    type CommonBatchDeleteParams = { ids: string[] };
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    // ---- Employee ----
    /**
     * employee onboarding state
     *
     * - `pending`: 待入职
     * - `onboarding`: 入职中
     * - `active`: 在职
     * - `resigned`: 已离职
     */
    type EmployeeStatus = 'pending' | 'onboarding' | 'active' | 'resigned';

    type Employee = Common.CommonRecord<{
      name: string;
      employeeNo: string;
      email: string | null;
      phone: string | null;
      position: string | null;
      avatar: string | null;
      status: EmployeeStatus;
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
      avatar?: string | null;
      tagIds?: string[] | null;
    };

    type EmployeeSearchParams = CommonType.RecordNullable<
      {
        name?: string;
        status?: EmployeeStatus;
        departmentId?: string;
      } & CommonSearchParams
    >;

    type EmployeeList = Common.PaginatingQueryRecord<Employee>;

    type EmployeeTransitionParams = {
      toState: EmployeeStatus;
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

    /** Public showcase overview (no auth required) */
    type ShowcaseOverview = {
      totals: {
        department: number;
        employee: number;
        tag: number;
      };
      employeeStatus: Record<string, number>;
      departments: {
        name: string;
        code: string;
        employeeCount: number;
      }[];
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
