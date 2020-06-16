import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { ErrorMessage, removeError } from 'src/app/store/error';

@Component({
  selector: 'app-ngbd-modal-content',
  templateUrl: './ngbd-modal-content.component.html',
  styleUrls: ['./ngbd-modal-content.component.css']
})
export class NgbdModalContentComponent implements OnInit {
  @Input() message;
  constructor(
    public activeModal: NgbActiveModal,
    private errorMessageStore: Store<{error: ErrorMessage}>,
    ) { }

  ngOnInit() {
  }

  close() {
    this.errorMessageStore.dispatch(removeError());
    return this.activeModal.close('Close click');
  }

}
