import { Component } from '@angular/core';
import { DesktopComponent } from './desktop/desktop.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DesktopComponent],
  template: '<app-desktop></app-desktop>',
  styles: ['']
})
export class AppComponent {
  title = 'Windows Desktop';
}
