import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {

  @Output() passEntry: EventEmitter<boolean> = new EventEmitter();
  @Input() public name;

  constructor(public modal: NgbActiveModal) {}

  confirmDeletion() {
    this.passEntry.emit(true);
    this.modal.close('Ok click');
  }

  cancel() {
    this.passEntry.emit(false);
    this.modal.dismiss('cancel click');
  }

}
