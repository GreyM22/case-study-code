import { EmployeePosition } from '../employee/employee-position.model';

export interface Position {
  id: string;
  name: string;
  description: string;
  creatAt: string;
  updateAt: string;
  departmentId: string;
  employeePosition?: EmployeePosition;
}
