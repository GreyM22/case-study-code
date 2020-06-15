import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';
import { NumberToArrayPipe } from './number-to-array.pipe';



@NgModule({
  declarations: [
    ConfirmEqualValidatorDirective,
    NumberToArrayPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [ConfirmEqualValidatorDirective, NumberToArrayPipe]
})
export class UtilModule { }
