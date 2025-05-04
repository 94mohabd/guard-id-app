export interface UploadResultViewModel {
    frontIdImage: string;
    backIdImage: string;
    selfieImage: string;
    frontIdFaceImage: string;
    selfieFaceImage: string;
    extractedLinesFrontID: string[];
    stringLines: string;
    barcodeText: BarcodeDataViewModel;
    barcodeTextstr: string;
    textSimilarity: number;
    faceMatch: string;
    faceScore: number;
    threshold: number;
    overallScore: number;
    faceScorePercentage: number;
}

export interface BarcodeDataViewModel {
    customerID: string;
    lastName: string;
    firstName: string;
    middleName: string;
    dateOfBirth: string;
    sex: string;
    height: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    issueDate: string;
    expiryDate: string;
    documentDiscriminator: string;
    issuerIdentificationNumber: string;
    country: string;
}