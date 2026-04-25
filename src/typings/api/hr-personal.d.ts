declare namespace Api {
  namespace HrPersonal {
    type MyProfileTag = {
      id: string;
      name: string;
      category: string;
      description: string | null;
    };

    type MyProfile = {
      id: string;
      name: string;
      employeeNo: string;
      email: string | null;
      phone: string | null;
      position: string | null;
      avatar: string | null;
      status: Api.HrManage.EmployeeStatus;
      departmentId: string;
      departmentName: string;
      tags: MyProfileTag[];
    };

    type MyProfileUpdateParams = {
      phone?: string | null;
      email?: string | null;
    };

    type Colleague = {
      id: string;
      name: string;
      employeeNo: string;
      position: string | null;
      avatar: string | null;
      status: Api.HrManage.EmployeeStatus;
      tagNames: string[];
    };

    type TeamStats = {
      department: { id: string; name: string; code: string };
      total: number;
      statusCounts: Record<Api.HrManage.EmployeeStatus, number>;
    };
  }
}
