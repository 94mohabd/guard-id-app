import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div class="container screen-enter">
      <div class="center-content">
        <h1>Welcome to Guard-Id Verify</h1>
        <p>Securely verify your identity in seconds.</p>
      </div>
      <div class="button-container">
        <button class="primary-button" (click)="startVerification()">Start Verification</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: var(--spacing-lg);
    }
    
    .center-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    h1 {
      font-size: 32px;
      margin-bottom: var(--spacing-md);
    }
    
    p {
      font-size: 18px;
      color: #666;
      margin-bottom: var(--spacing-xxl);
    }
    
    .button-container {
      margin-bottom: var(--spacing-xl);
    }
  `]
})
export class WelcomeComponent {
  constructor(
    private router: Router,
  ) { }

  startVerification() {
    // Navigate to the first step
    this.router.navigate(['/id-upload-front']);
  }
}