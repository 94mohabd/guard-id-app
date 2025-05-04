import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ImageVerificationService } from '../../services/image-verification.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-id-upload-back',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <div class="container screen-enter">
      <div class="header">
        <a routerLink="/id-upload-front" class="back-button">←</a>
      </div>

      <div class="content">
        <h2>Upload Back<br>of Your ID</h2>
        <p>Make sure the barcode is clear<br>and fully visible.</p>
        
        <div class="upload-area" (click)="triggerFileInput()">
          <div class="id-placeholder" *ngIf="!selectedFile && !previewUrl">
            <span class="material-icons">credit_card</span>
            <div class="placeholder-lines">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
          </div>
          <div *ngIf="isLoading" class="loading-message">
            Checking Image, please wait...
            <div class="spinner"></div>
          </div>
          <div *ngIf="errorMessage" class="error-message">
            <strong>Error: </strong>{{ errorMessage }}
          </div>
          <img *ngIf="previewUrl" [src]="previewUrl" alt="ID preview" class="preview-image">
          <input 
            type="file" 
            #fileInput 
            style="display: none" 
            accept="image/*"
            (change)="onFileSelected($event)"
          >
        </div>
      </div>

      <div class="footer" *ngIf="isValidated && !errorMessage">
        <button class="primary-button" (click)="uploadPhoto()">
          Continue to Selfie
        </button>
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
    
    .header {
      padding: var(--spacing-md) 0;
    }
    
    .content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: var(--spacing-xl);
      text-align: center;
    }
    
    h2 {
      font-size: 24px;
      margin-bottom: var(--spacing-md);
    }
    
    p {
      color: #666;
      margin-bottom: var(--spacing-xl);
    }
    
    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-xl);
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: var(--spacing-lg) 0;
      cursor: pointer;
      position: relative;
    }
    
    .id-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #aaa;
    }
    
    .id-placeholder .material-icons {
      font-size: 48px;
      margin-bottom: var(--spacing-md);
    }
    
    .placeholder-lines {
      width: 120px;
    }
    
    .line {
      height: 8px;
      background-color: var(--medium-gray);
      margin-bottom: 8px;
      border-radius: 4px;
    }
    
    .loading-message {
      color: var(--primary-color);
      text-align: center;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--primary-color);
      border-top-color: transparent;
      border-radius: 50%;
      margin: 10px auto;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .error-message {
      color: #dc3545;
      text-align: center;
      margin-top: var(--spacing-md);
    }
    
    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .footer {
      padding: var(--spacing-lg) 0;
    }
  `]
})
export class IdUploadBackComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile?: File | null = null;
  previewUrl?: string | null = null;
  isLoading = false;
  errorMessage?: string | null = null;
  isValidated = false;

  constructor(
    private imageVerificationService: ImageVerificationService,
    private router: Router
  ) { }

  ngOnInit() {
    const backId = localStorage.getItem('backId');
    if (backId) {
      this.previewUrl = backId;
      this.selectedFile = null; // or keep as is if you want to allow re-upload
      this.isValidated = true;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      this.errorMessage = null;
      this.isLoading = true;
      this.isValidated = false;
      this.previewUrl = null;

      try {
        const result = await this.imageVerificationService.processBackIdImage(this.selectedFile);

        if (result.success) {
          this.previewUrl = result.previewUrl;
          this.selectedFile = result.resizedImage;
          this.isValidated = true;
          // Store the image in localStorage
          if (result.previewUrl) {
            localStorage.setItem('backId', result.previewUrl);
          }
        } else {
          localStorage.removeItem('backId');
          this.errorMessage = result.message;
        }
      } catch (error) {
        this.errorMessage = 'Error processing image. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  uploadPhoto() {
    if (this.isValidated && !this.errorMessage) {
      this.router.navigate(['/selfie']);
    }
  }
} 