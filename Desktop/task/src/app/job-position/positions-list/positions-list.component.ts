import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { Position } from '../position.model';
import { PositionService } from '../position.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/modal/confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-positions-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.css']
})
export class PositionsListComponent implements OnInit{

  @Input() position: Position;
  constructor(
    private positionService: PositionService,
    public authService: AuthService,
    private confirmationModalService: NgbModal
  ) { }

  ngOnInit() {
  }

  delete(id: string) {
    const modalRef = this.confirmationModalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.name = 'delete ' + this.position.name + ' Position';
    modalRef
      .componentInstance
      .passEntry
      .subscribe(
        confirmation => {
          if (confirmation) {
            // call the service to delete the selected department
            this.positionService
              .deleteById(id)
              .subscribe(
                res => {
                  // after deleting the department in the backend
                  // remove the department for the array in the frontend
                  console.log(res.message);
                },
                err => console.log(err)
              );
          }
        }
      )
  }

}
