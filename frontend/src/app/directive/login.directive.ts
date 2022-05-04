import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[hasBiometrics]',
})
export class BiometricsDirective implements OnInit {
  @Output() public send = new EventEmitter<boolean>();

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    if (('credentials' in navigator)) {
      this.element.nativeElement.innerText = 'Navegador com suporte a biometria';
      this.element.nativeElement.classList.add('has-bio');
      this.element.nativeElement.classList.remove('not-bio');
      this.send.emit(true);
    } else {
      this.element.nativeElement.innerText = 'Navegador não tem suporte a biometria';
      this.element.nativeElement.classList.add('not-bio');
      this.element.nativeElement.classList.remove('has-bio');
      this.send.emit(false);
    }
  }

}
