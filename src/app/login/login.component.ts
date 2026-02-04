import { Component, EventEmitter, OnDestroy, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  @Output() login = new EventEmitter<boolean>();

  loginDelay: number = 0; // 4 seconds delay to simulate login process
  time = signal(this.formatTime(new Date()));
  date = signal(this.formatDate(new Date()));
  isLoading = signal(false);
  private intervalId: number | null = null;

  constructor() {
    this.intervalId = window.setInterval(() => {
      const now = new Date();
      this.time.set(this.formatTime(now));
      this.date.set(this.formatDate(now));
    }, 1_000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }
  }

  onSubmit(): void {
    if (this.isLoading()) {
      return;
    }
    
    this.isLoading.set(true);
    
    setTimeout(() => {
      this.login.emit(true);
      this.isLoading.set(false);
    }, this.loginDelay);
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }
}
