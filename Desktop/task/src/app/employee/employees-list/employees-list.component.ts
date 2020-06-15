import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../employee.model';
import { Position } from '../../job-position/position.model';
import { EmployeeService } from '../employee.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  @Input() employee: Employee;
  employeeJobPosition: Position;

  constructor(
    private employeeService: EmployeeService,
    public authService: AuthService,
    private confirmationModalService: NgbModal
  ) { }

  ngOnInit() {
    this.employeeService
      .getEmployeeJobPosition(this.employee.id)
      .subscribe(
        res => {
          this.employeeJobPosition = res.position;
          console.log(res.message);
        },
        err => console.log(err.message)
      );
  }

  fireEmployee() {
    const name = this.employee.name;
    const surname = this.employee.surname;
    const modalRef = this.confirmationModalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.name = 'fire ' + name + ' ' + surname;
    modalRef
      .componentInstance
      .passEntry
      .subscribe(
        confirmation => {
          if (confirmation) {
            this.employeeService
              .fireEmployee(this.employee.id);
          }
        }
      )
  }

}
