import { Component, OnInit } from '@angular/core';
import { UploadResultViewModel } from '../../models/upload-result.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-result',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div *ngIf="error" class="result-container">
        <div class="error-header card-result restyled-header">
          <div class="summary-header-content">
            <div class="summary-left">
              <h1 style="color:#b91c1c;">Verification Error</h1>
              <p style="color:#991b1b; font-weight:500;">{{ error }}</p>
            </div>
            <div class="summary-right">
              <button class="error-btn" (click)="clearAndGoHome()">Try Again</button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!error" class="result-container">
        <!-- Header Summary -->
        <div  class="summary-header card-result restyled-header">
          <div class="summary-header-content">
            <div class="summary-left">
              <h1>ID Verification Results</h1>
              <p>Comprehensive analysis of the provided identification documents</p>
            </div>
            <div class="summary-right">
              <div class="status-badge success">Verification Successful</div>
              <div class="score-circle">
                <span class="score">{{ result?.overallScore | number:'1.0-0' }}%</span>
              </div>
              <div class="score-bars">
                <div class="score-bar">
                  <span>Face Match:</span>
                  <div class="bar"><div class="fill" [style.width]="(result?.faceScorePercentage || 0) + '%'" style="background:#3b82f6"></div></div>
                  <span>{{ result?.faceScorePercentage || 0 }}%</span>
                </div>
                <div class="score-bar">
                  <span>Text Match:</span>
                  <div class="bar"><div class="fill" [style.width]="(result?.textSimilarity || 0) + '%'" style="background:#a21caf"></div></div>
                  <span>{{ result?.textSimilarity || 0 }}%</span>
                </div>
              </div>
              <button class="verify-btn" (click)="clearAndGoHome()">Verify New ID</button>
            </div>
          </div>
        </div>

        <!-- Document Images Tabs -->
        <div class="card-result images-card">
          <div class="tabs">
            <button [class.active]="activeTab === 'front'" (click)="activeTab = 'front'">Front of ID</button>
            <button [class.active]="activeTab === 'back'" (click)="activeTab = 'back'">Back of ID</button>
            <button [class.active]="activeTab === 'selfie'" (click)="activeTab = 'selfie'">Selfie</button>
          </div>
          <div class="tab-content">
            <img *ngIf="activeTab === 'front'" [src]="formatImageUrl(result?.frontIdImage || '')" alt="Front of ID" class="doc-image" />
            <img *ngIf="activeTab === 'back'" [src]="formatImageUrl(result?.backIdImage || '')" alt="Back of ID" class="doc-image" />
            <img *ngIf="activeTab === 'selfie'" [src]="formatImageUrl(result?.selfieImage || '')" alt="Selfie" class="doc-image" />
          </div>
        </div>

        <div class="main-grid">
          <!-- Left Column: Identity Info & Location -->
          <div class="left-col">
            <div class="card-result info-card">
              <div class="info-header">
                <span class="info-title">Identity Information From Barcode</span>
                <span class="match-badge good">Text Similarity: {{ result?.textSimilarity || 0 }}% Good Match</span>
              </div>
              <div class="info-section">
                <div class="info-block">
                  <div class="info-label">Full Name:</div>
                  <div class="info-value">{{ result?.barcodeText?.firstName }} {{ result?.barcodeText?.middleName }} {{ result?.barcodeText?.lastName }}</div>
                  <div class="info-label">Customer ID:</div>
                  <div class="info-value">{{ result?.barcodeText?.customerID }}</div>
                  <div class="info-label">Date of Birth:</div>
                  <div class="info-value">{{ result?.barcodeText?.dateOfBirth | date:'shortDate' }}</div>
                  <div class="info-label">Gender:</div>
                  <div class="info-value">{{ result?.barcodeText?.sex }}</div>
                  <div class="info-label">Height:</div>
                  <div class="info-value">{{ result?.barcodeText?.height }}</div>
                </div>
                <div class="info-block">
                  <div class="info-label">Street:</div>
                  <div class="info-value">{{ result?.barcodeText?.street }}</div>
                  <div class="info-label">City:</div>
                  <div class="info-value">{{ result?.barcodeText?.city }}</div>
                  <div class="info-label">State:</div>
                  <div class="info-value">{{ result?.barcodeText?.state }}</div>
                  <div class="info-label">Postal Code:</div>
                  <div class="info-value">{{ result?.barcodeText?.postalCode }}</div>
                  <div class="info-label">Country:</div>
                  <div class="info-value">{{ result?.barcodeText?.country }}</div>
                </div>
                <div class="info-block">
                  <div class="info-label">Issue Date:</div>
                  <div class="info-value">{{ result?.barcodeText?.issueDate | date:'shortDate' }}</div>
                  <div class="info-label">Expiry Date:</div>
                  <div class="info-value">{{ result?.barcodeText?.expiryDate | date:'shortDate' }}</div>
                  <div class="info-label">Document Discriminator:</div>
                  <div class="info-value">{{ result?.barcodeText?.documentDiscriminator }}</div>
                  <div class="info-label">Issuer ID:</div>
                  <div class="info-value">{{ result?.barcodeText?.issuerIdentificationNumber }}</div>
                </div>
              </div>
            </div>          
          </div>

          <!-- Right Column: Face, Extracted Text, Metadata -->
          <div class="right-col">
            <div class="card-result face-card">
              <div class="face-header">
                <span>Face Comparison</span>
                <span class="match-badge match">MATCH</span>
              </div>
              <div class="face-images">
                <div class="face-img-block">
                  <img [src]="formatImageUrl(result?.frontIdFaceImage || '')" alt="ID Image" />
                  <div class="face-label">ID Image</div>
                </div>
                <div class="face-img-block">
                  <img [src]="formatImageUrl(result?.selfieFaceImage || '')" alt="Selfie" />
                  <div class="face-label">Selfie</div>
                </div>
              </div>
              <div class="face-score-circle">
                <span class="score">{{ result?.faceScorePercentage || 0 | number:'1.0-0'}}%</span>
              </div>
              <div class="face-match-desc">
                The facial features match the ID with sufficient confidence.<br>
                Score: {{ result?.faceScore }} (Threshold: {{ result?.threshold }})
              </div>
            </div>             
          </div>
        </div>
        
        <div class="card-result extracted-card">
              <div class="extracted-header">
                <span>Extracted Front of ID Text</span>
                <button class="hide-details" (click)="showExtractedDetails = !showExtractedDetails">
                  {{ showExtractedDetails ? 'Hide Details' : 'Show Details' }}
                </button>
              </div>
              <div class="extracted-content" *ngIf="showExtractedDetails">
                <pre>{{ result?.extractedLinesFrontID?.join('\n') || '' }}</pre>
                <div class="note">Note: This data was extracted using OCR from the front of the ID. It is compared against barcode data for accuracy validation.</div>
              </div>
            </div>
      </div>
    `,
  styles: [`
    body, html { background: #f6faf9; }
    .result-container {      
      min-height: 100vh;
      padding: 32px;
      max-width: 1400px;      /* Wide, but not too wide */
      margin: 0 auto;         /* Center horizontally */
      box-sizing: border-box;
    }
    .main-grid {
      display: flex;
      gap: 32px;
      justify-content: center;
    }
    .card-result {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-bottom: 24px;
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
    }
    .left-col, .right-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 0;
    }
    .info-card, .location-card, .face-card, .extracted-card, .metadata-card { min-width: 0; }
    .restyled-header {
      background: linear-gradient(90deg, #f0f4ff 0%, #e0f7fa 100%);
      border: 1.5px solid #e0e7ff;
      box-shadow: 0 4px 24px 0 rgba(56, 189, 248, 0.08);
      border-radius: 18px;
      margin-bottom: 36px;
      padding: 32px 36px 24px 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .summary-header-content {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }
    .summary-left h1 {
      margin: 0 0 8px 0;
      font-size: 2.2rem;
      font-weight: 700;
      color: #1e293b;
    }
    .summary-left p {
      color: #64748b;
      margin: 0;
      font-size: 1.1rem;
    }
    .summary-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }
    .verify-btn {
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 28px;
      font-weight: 700;
      font-size: 1.08rem;
      margin-bottom: 10px;
      margin-left: 0;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(37,99,235,0.08);
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .verify-btn:hover {
      background: #1d4ed8;
      color: #fff;
      box-shadow: 0 4px 16px rgba(37,99,235,0.13);
    }
    .status-badge { background: #d1fae5; color: #065f46; border-radius: 8px; padding: 6px 16px; font-weight: 600; margin-bottom: 12px; }
    .status-badge.success { background: #d1fae5; color: #065f46; }
    .score-circle { width: 80px; height: 80px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 1.7rem; font-weight: 700; color: #10b981; margin-bottom: 12px; }
    .score-bars { width: 220px; }
    .score-bar { display: flex; align-items: center; margin-bottom: 6px; font-size: 0.95rem; }
    .score-bar span:first-child { width: 110px; color: #374151; }
    .bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; margin: 0 8px; overflow: hidden; }
    .fill { height: 100%; border-radius: 4px; }
    .view-details { background: #3b82f6; color: #fff; border: none; border-radius: 8px; padding: 6px 18px; font-weight: 600; margin-top: 8px; cursor: pointer; }
    .images-card { margin-bottom: 32px; }
    .tabs { display: flex; border-bottom: 2px solid #e5e7eb; margin-bottom: 16px; }
    .tabs button { background: none; border: none; padding: 12px 24px; font-size: 1rem; cursor: pointer; color: #6b7280; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
    .tabs button.active { color: #3b82f6; border-bottom: 2px solid #3b82f6; font-weight: 600; }
    .tab-content { text-align: center; }
    .doc-image { max-width: 100%; max-height: 260px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .info-header, .face-header, .extracted-header, .metadata-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .info-title { font-size: 1.1rem; font-weight: 600; }
    .match-badge { background: #f3f4f6; color: #10b981; border-radius: 8px; padding: 2px 12px; font-size: 0.95rem; font-weight: 600; }
    .match-badge.good { background: #e0e7ff; color: #2563eb; }
    .match-badge.match { background: #d1fae5; color: #065f46; }
    .info-section { display: flex; gap: 32px; }
    .info-block { flex: 1; }
    .info-label { color: #6b7280; font-size: 0.97rem; margin-top: 8px; }
    .info-value { font-weight: 500; font-size: 1.05rem; margin-bottom: 4px; }
    .location-section { display: flex; gap: 32px; }
    .location-block { flex: 1; }
    .distance-badge { background: #f3f4f6; color: #3b82f6; border-radius: 8px; padding: 4px 14px; font-weight: 600; margin: 12px 0; display: inline-block; }
    .location-note { color: #6b7280; font-size: 0.97rem; margin-top: 4px; }
    .face-card { text-align: center; }
    .face-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .face-images { display: flex; justify-content: center; gap: 24px; margin-bottom: 12px; }
    .face-img-block { text-align: center; }
    .face-img-block img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #e5e7eb; }
    .face-label { color: #6b7280; font-size: 0.95rem; margin-top: 4px; }
    .face-score-circle { width: 60px; height: 60px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: #10b981; margin: 0 auto 8px auto; }
    .face-match-desc { color: #374151; font-size: 0.98rem; margin-bottom: 8px; }
    .extracted-card pre { background: #f3f4f6; border-radius: 8px; padding: 12px; font-size: 1rem; margin: 0 0 8px 0; }
    .note { color: #6b7280; font-size: 0.95rem; margin-top: 4px; background: #e0e7ff; border-radius: 6px; padding: 6px 10px; }
    .metadata-content { display: flex; gap: 32px; }
    .metadata-block { flex: 1; }
    .hide-details { background: none; border: none; color: #3b82f6; font-weight: 600; cursor: pointer; font-size: 0.95rem; }
    @media (max-width: 1100px) {
      .main-grid { flex-direction: column; gap: 0; }
      .left-col, .right-col { gap: 24px; }
    }
    @media (max-width: 700px) {
      .result-container { padding: 8px; max-width: 100vw; }
      .summary-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .main-grid { flex-direction: column; gap: 0; }
      .left-col, .right-col { gap: 16px; }
      .info-section, .location-section, .metadata-content { flex-direction: column; gap: 12px; }
    }
    .error-header {
      background: linear-gradient(90deg, #fef2f2 0%, #f3e8ff 100%);
      border: 1.5px solid #fecaca;
      box-shadow: 0 4px 24px 0 rgba(239, 68, 68, 0.08);
      border-radius: 18px;
      margin-bottom: 36px;
      padding: 32px 36px 24px 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .error-btn {
      background: #ef4444;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 28px;
      font-weight: 700;
      font-size: 1.08rem;
      margin-bottom: 10px;
      margin-left: 0;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(239,68,68,0.08);
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .error-btn:hover {
      background: #b91c1c;
      color: #fff;
      box-shadow: 0 4px 16px rgba(239,68,68,0.13);
    }
  `]
})
export class VerificationResultComponent implements OnInit {
  result?: UploadResultViewModel;
  error?: string;
  matches: string[] = [];
  noMatches: string[] = [];
  score: number = 0;
  totalWordsChecked: number = 0;
  activeTab: 'front' | 'back' | 'selfie' = 'front';
  showExtractedDetails = true;
  showMetadataDetails = true;

  ngOnInit() {
    const storedResult = localStorage.getItem('verificationResult');
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // If the server returned an error object, show its message
        if (parsed && parsed.error && parsed.error.message) {
          this.error = parsed.error.message;
        } else {
          this.result = parsed;
          // Parse the stringLines to get matches and noMatches
          if (this.result?.stringLines) {
            const lines = this.result.stringLines.split('\n');
            this.matches = lines.filter(line => line.startsWith('Match:'));
            this.noMatches = lines.filter(line => line.startsWith('No Match:'));
            this.score = this.matches.length;
            this.totalWordsChecked = this.matches.length + this.noMatches.length;
          }
        }
      } catch (error) {
        this.error = 'Error parsing verification result.';
      }
    } else {
      this.error = 'No verification result found. Please complete the verification process.';
    }
  }

  formatImageUrl(base64String: string): string {
    if (!base64String) return '';
    if (base64String.startsWith('data:image')) {
      return base64String;
    }
    return `data:image/jpeg;base64,${base64String}`;
  }

  clearAndGoHome() {
    localStorage.clear();
    window.location.href = '/id-upload-front';
  }
} 