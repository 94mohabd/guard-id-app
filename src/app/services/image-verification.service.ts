import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { firstValueFrom, catchError } from 'rxjs';

export interface ErrorResponse {
    errorCode: string;
    message: string;
    details?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ImageVerificationService {
    private apiBaseUrl = 'https://guardid-dugdbpembqa0ega6.centralus-01.azurewebsites.net/api/Detection';

    constructor(private http: HttpClient) { }

    async resizeImageTo1MB(file: File): Promise<File> {
        const maxFileSize = 1024 * 1024; // 1MB
        if (file.size <= maxFileSize) {
            return file;
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    let width = img.width;
                    let height = img.height;

                    // Calculate the new dimensions
                    if (width > height) {
                        if (width > 1024) {
                            height = Math.round((height *= 1024 / width));
                            width = 1024;
                        }
                    } else {
                        if (height > 1024) {
                            width = Math.round((width *= 1024 / height));
                            height = 1024;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        blob => {
                            if (!blob) {
                                reject(new Error('Could not create blob'));
                                return;
                            }

                            if (blob.size > maxFileSize) {
                                // Recursively resize if still too large
                                const newFile = new File([blob], file.name, { type: 'image/jpeg' });
                                this.resizeImageTo1MB(newFile).then(resolve).catch(reject);
                            } else {
                                const resizedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: file.lastModified
                                });
                                resolve(resizedFile);
                            }
                        },
                        'image/jpeg',
                        0.7
                    );
                };
                img.onerror = () => reject(new Error('Error loading image'));
                img.src = event.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsDataURL(file);
        });
    }

    async detectFaceInImage(file: File): Promise<{ success: boolean; message: string }> {
        const formData = new FormData();
        formData.append('imageFile', file);
        try {
            return await firstValueFrom(
                this.http.post<{ success: boolean; message: string }>(`${this.apiBaseUrl}/detect-face`, formData)
            );
        } catch (error: any) {
            throw this.parseErrorResponse(error);
        }
    }

    async detectTextInImage(file: File): Promise<{ success: boolean; message: string }> {
        const formData = new FormData();
        formData.append('imageFile', file);
        try {
            return await firstValueFrom(
                this.http.post<{ success: boolean; message: string }>(`${this.apiBaseUrl}/detect-text`, formData)
            );
        } catch (error: any) {
            throw this.parseErrorResponse(error);
        }
    }

    async detectBarcodeInImage(file: File): Promise<{ success: boolean; message: string }> {
        const formData = new FormData();
        formData.append('imageFile', file);
        try {
            return await firstValueFrom(
                this.http.post<{ success: boolean; message: string }>(`${this.apiBaseUrl}/detect-barcode`, formData)
            );
        } catch (error: any) {
            throw this.parseErrorResponse(error);
        }
    }

    async processFrontIdImage(file: File): Promise<{
        success: boolean;
        message?: string;
        resizedImage?: File;
        previewUrl?: string;
    }> {
        try {
            const resizedImage = await this.resizeImageTo1MB(file);
            const faceResult = await this.detectFaceInImage(resizedImage);
            const textResult = await this.detectTextInImage(resizedImage);

            if (!faceResult.success) {
                return { success: false, message: faceResult.message };
            }

            if (!textResult.success) {
                return { success: false, message: textResult.message };
            }

            const previewUrl = await this.createPreviewUrl(resizedImage);
            return {
                success: true,
                resizedImage,
                previewUrl
            };
        } catch (error: any) {
            return { success: false, message: error.message || 'Error processing image' };
        }
    }

    async processBackIdImage(file: File): Promise<{
        success: boolean;
        message?: string;
        resizedImage?: File;
        previewUrl?: string;
    }> {
        try {
            const resizedImage = await this.resizeImageTo1MB(file);
            const barcodeResult = await this.detectBarcodeInImage(resizedImage);

            if (!barcodeResult.success) {
                return { success: false, message: barcodeResult.message };
            }

            const previewUrl = await this.createPreviewUrl(resizedImage);
            return {
                success: true,
                resizedImage,
                previewUrl
            };
        } catch (error: any) {
            return { success: false, message: error.message || 'Error processing image' };
        }
    }

    async processSelfieImage(file: File): Promise<{
        success: boolean;
        message?: string;
        resizedImage?: File;
        previewUrl?: string;
    }> {
        try {
            const resizedImage = await this.resizeImageTo1MB(file);
            const faceResult = await this.detectFaceInImage(resizedImage);

            if (!faceResult.success) {
                return { success: false, message: faceResult.message };
            }

            const previewUrl = await this.createPreviewUrl(resizedImage);
            return {
                success: true,
                resizedImage,
                previewUrl
            };
        } catch (error: any) {
            return { success: false, message: error.message || 'Error processing image' };
        }
    }

    private createPreviewUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Error creating preview'));
            reader.readAsDataURL(file);
        });
    }

    private parseErrorResponse(error: any): ErrorResponse {
        let errorResponse: ErrorResponse = {
            errorCode: 'UNKNOWN_ERROR',
            message: 'An unknown error occurred.',
            details: ''
        };
        if (error?.error) {
            errorResponse = {
                errorCode: error.error.errorCode || 'UNKNOWN_ERROR',
                message: error.error.message || 'An error occurred.',
                details: error.error.details || ''
            };
        }
        return errorResponse;
    }
} 