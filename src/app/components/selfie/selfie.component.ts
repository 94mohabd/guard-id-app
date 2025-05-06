import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ImageVerificationService } from '../../services/image-verification.service';
import { UploadService } from '../../services/upload.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-selfie',
  standalone: true,
  imports: [RouterLink, NgIf],
  template: `
    <div class="container screen-enter">
      <div class="header">
        <a routerLink="/id-upload-back" class="back-button">←</a>
      </div>

      <div class="content">
        <h2>Take a Selfie</h2>
        <p>Make sure you're well-lit<br>and facing the camera.</p>
        
        <div class="upload-area" (click)="triggerFileInput()">
          <div class="selfie-placeholder" *ngIf="!selectedFile && !previewUrl">
            <span class="material-icons">face</span>
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
          <img *ngIf="previewUrl" [src]="previewUrl" alt="Selfie preview" class="preview-image">
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
        <button class="primary-button" (click)="uploadPhoto()" [disabled]="isUploading">
          {{ isUploading ? 'Uploading...' : 'Complete Verification' }}
        </button>
      </div>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isUploading">
        <div class="loading-content">
          <div class="spinner"></div>
          <p>Uploading your verification...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: var(--spacing-lg);
      position: relative;
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
    
    .selfie-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #aaa;
    }
    
    .selfie-placeholder .material-icons {
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

    .primary-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loading-content {
      text-align: center;
      padding: var(--spacing-xl);
      background-color: white;
      border-radius: var(--border-radius-md);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .loading-content .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--primary-color);
      border-top-color: transparent;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }

    .loading-content p {
      color: var(--primary-color);
      font-size: 16px;
      margin: 0;
    }
  `]
})
export class SelfieComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile?: File | null = null;
  previewUrl?: string | null = null;
  isLoading = false;
  isUploading = false;
  errorMessage?: string | null = null;
  isValidated = false;

  constructor(
    private imageVerificationService: ImageVerificationService,
    private uploadService: UploadService,
    private router: Router
  ) { }

  ngOnInit() {
    const selfie = localStorage.getItem('selfie');
    if (selfie) {
      this.previewUrl = selfie;
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
        const result = await this.imageVerificationService.processSelfieImage(this.selectedFile);

        if (result.success) {
          this.previewUrl = result.previewUrl;
          this.selectedFile = result.resizedImage;
          this.isValidated = true;
          localStorage.setItem('selfie', result.previewUrl!);
        } else {
          localStorage.removeItem('selfie');
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
      this.isUploading = true;
      this.errorMessage = null;

      // Get the stored images from localStorage
      const frontId = localStorage.getItem('frontId');
      const backId = localStorage.getItem('backId');
      const selfie = localStorage.getItem('selfie');
      if (!frontId || !backId || !selfie) {
        this.errorMessage = 'Missing ID images. Please upload them again.';
        this.isUploading = false;
        return;
      }

      // Convert base64 strings back to Files
      const frontIdFile = this.dataURLtoFile(frontId, 'frontId.jpg');
      const backIdFile = this.dataURLtoFile(backId, 'backId.jpg');
      const selfieFile = this.dataURLtoFile(selfie, 'selfie.jpg');
      // Create subscription
      const uploadSub = this.uploadService.uploadVerificationImages(
        frontIdFile,
        backIdFile,
        selfieFile
      ).subscribe({
        next: (result) => {
          if (result.success) {
            // Store the verification result
            localStorage.setItem('verificationResult', JSON.stringify(result.result));
            // Navigate to result page
            this.router.navigate(['/verification-result']);
          } else {
            this.errorMessage = result.message;
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error uploading images';
        },
        complete: () => {
          this.isUploading = false;
          uploadSub.unsubscribe();
        }
      });
    }
  }

  private dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}