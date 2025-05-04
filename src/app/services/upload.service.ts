import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UploadResultViewModel } from '../models/upload-result.model';

export interface ErrorResponse {
    errorCode: string;
    message: string;
    details?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiBaseUrl = 'https://localhost:7042/api/Detection';

    constructor(private http: HttpClient) { }

    uploadVerificationImages(frontId: File, backId: File, selfie: File): Observable<{ success: boolean; message: string; result?: any; error?: ErrorResponse }> {
        const formData = new FormData();
        formData.append('frontId', frontId);
        formData.append('backId', backId);
        formData.append('selfie', selfie);

        return this.http.post<any>(`${this.apiBaseUrl}/verify-id`, formData).pipe(
            map(response => ({
                success: true,
                message: 'Upload successful',
                result: response
            })),
            catchError(error => {
                let errorResponse: ErrorResponse = {
                    errorCode: 'UNKNOWN_ERROR',
                    message: 'An unknown error occurred.',
                    details: ''
                };
                if (error.error) {
                    errorResponse = {
                        errorCode: error.error.errorCode || 'UNKNOWN_ERROR',
                        message: error.error.message || 'An error occurred.',
                        details: error.error.details || ''
                    };
                }
                return throwError(() => ({
                    success: false,
                    message: errorResponse.message,
                    error: errorResponse
                }));
            })
        );
    }
}