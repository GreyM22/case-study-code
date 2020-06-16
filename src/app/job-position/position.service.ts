import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Position } from './position.model';

const BACKEND_URL = environment.apiUrl + '/positions';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private positions: Position[] = [];
  public positionsUpdated = new Subject<Position[]>();
  private totalNumberOfPosition: number;

  constructor(private http: HttpClient) { }

  getNumberOfPosition() {
    return this.totalNumberOfPosition;
  }

  postPosition(newName: string, newDescription: string, idDepartment: string): Observable<any> {
    const position: Position = {
      id: null,
      name: newName,
      description: newDescription,
      creatAt: null,
      updateAt: null,
      departmentId: idDepartment
    };
    return this.http.post<{message: string}>(BACKEND_URL, position);
  }

  getPositions(departmentId: string, pageNumber?: number , pageSize?: number ) {
    console.log(      BACKEND_URL + '/' + departmentId + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize)
    this.http.get<{message: string, positions: Position[], totalNumber: number}>(
      BACKEND_URL + '/' + departmentId + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize
    )
    .subscribe(
      res => {
        console.log(res.message);
        this.positions = res.positions;
        this.totalNumberOfPosition = res.totalNumber;
        this.positionsUpdated.next([...this.positions]);
      },
      err => console.log(err.message)
    );
  }

  getUpdatedPositions(): Observable<any> {
    return this.positionsUpdated.asObservable();
  }

  updatePosition(
    departmentID: string,
    positionId: string,
    updatedName: string,
    updatedDescription: string
  ): Observable<any> {
    const position: Position = {
      id: positionId,
      name: updatedName,
      description: updatedDescription,
      creatAt: null,
      updateAt: null,
      departmentId: departmentID
    };
    return this.http.post(BACKEND_URL + '/' + positionId, position);
  }

  getById(positionId: string): Observable<any> {
    return this.http
      .get<{message: string, position: Position}>(BACKEND_URL + '/edit/' + positionId);
  }

  deleteById(positionId: string): Observable<any> {
    this.positions = this.positions.filter(
      position => position.id !== positionId
    );
    this.positionsUpdated.next([...this.positions]);
    return this.http.delete<{message: string}>(BACKEND_URL + '/' + positionId);
  }
}
