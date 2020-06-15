import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialCharacterNoWhiteSpaceDirective } from './special-character-no-white-space.directive';
import { SpecialCharacterDirective } from './special-character.directive';




@NgModule({
  declarations: [
    SpecialCharacterNoWhiteSpaceDirective,
    SpecialCharacterDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [SpecialCharacterDirective, SpecialCharacterNoWhiteSpaceDirective]
})
export class ValidatorsModule { }
