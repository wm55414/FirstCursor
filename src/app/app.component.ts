import { Component, signal } from '@angular/core';
import { DesktopComponent } from './desktop/desktop.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DesktopComponent, LoginComponent],
  template: `
    @if (!isAuthenticated()) {
      <app-login (login)="handleLogin($event)"></app-login>
    } @else {
      <app-desktop></app-desktop>
    }
  `,
  styles: [':host { display: block; height: 100vh; }']
})
export class AppComponent {
  title = 'Windows Desktop';
  isAuthenticated = signal(false);

  handleLogin(_authed: boolean): void {
    this.isAuthenticated.set(true);
  }
}
