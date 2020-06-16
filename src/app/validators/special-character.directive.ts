import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[specialIsAlphaNumericWithSpace]'
})
export class SpecialCharacterDirective {

  regexStr = '^[a-zA-Z0-9_]*$';
  @Input() isAlphaNumeric: boolean;


  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    if ( event.key === ' ') return;
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[[^0-9a-zA-Z]+]/g,
        '').replace(/\s/g, '');
      event.preventDefault();

    }, 100);
  }

}
