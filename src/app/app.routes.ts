import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'id-upload-front',
    loadComponent: () => import('./components/id-upload/id-upload.component').then(m => m.IdUploadComponent)
  },
  {
    path: 'id-upload-back',
    loadComponent: () => import('./components/id-upload-back/id-upload-back.component').then(m => m.IdUploadBackComponent)
  },
  {
    path: 'selfie',
    loadComponent: () => import('./components/selfie/selfie.component').then(m => m.SelfieComponent)
  },
  {
    path: 'verification-result',
    loadComponent: () => import('./components/verification-result/verification-result.component').then(m => m.VerificationResultComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];