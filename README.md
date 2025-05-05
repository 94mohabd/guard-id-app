# Guard ID App

Guard ID is a modern Angular application for secure and automated identity verification. It allows users to upload images of their ID (front and back) and a selfie, then performs:

- **Face matching** between ID and selfie
- **Text extraction** (OCR) from the ID
- **Barcode reading** from the back of the ID
- **Location and metadata checks**
- **Comprehensive result dashboard** with match scores and extracted information

## Features
- Upload and preview ID and selfie images
- Automated face, text, and barcode detection
- Displays extracted and matched information in a modern dashboard
- Error handling and user guidance throughout the process
- Ready for deployment to GitHub Pages

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app locally:**
   ```bash
   ng serve
   ```
   Then visit [http://localhost:4200](http://localhost:4200)

3. **Build for production:**
   ```bash
   ng build --base-href "/guard-id-app/"
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npx angular-cli-ghpages --dir=dist/guard-id-app
   ```

## Project Structure
- `src/app/components/` — Angular components for each step of the verification flow
- `src/app/services/` — Services for image processing and API communication
- `src/app/models/` — TypeScript interfaces for data models

## License
MIT
