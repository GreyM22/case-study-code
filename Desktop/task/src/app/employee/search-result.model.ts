export interface SearchResult {
  id: number;
  name: string;
  surname: string;
  // employees current job position
  positionName: string;
  photo: string;
  startedDate?: string;
  departmentId?: number;
  departmentName?: string;
}
