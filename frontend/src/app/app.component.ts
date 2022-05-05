import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private sanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
  ) {
    this.initializeSvgIcon()
  }

  private addSvgIcon(name: string, alias?: string, namespace?: string): this {
    const path = this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + name + '.svg');
    alias = alias ? alias : name;
    if (namespace) {
      this.matIconRegistry.addSvgIconInNamespace(namespace, alias, path);
    } else {
      this.matIconRegistry.addSvgIcon(alias, path);
    }
    return this;
  }

  private initializeSvgIcon() {
    this.addSvgIcon('visibility_black_24dp')
      .addSvgIcon('visibility_off_black_24dp')
  }
}
