# Content Editor Setup Guide

## Project Overview
The project consists of two separate repositories:
- `content-editor-fe` (Frontend)
- `content-editor-be` (Backend)

## Option 1: Using Deployed Version

### Frontend
- Access the client application at: [https://content-editor-fe.vercel.app/](https://content-editor-fe.vercel.app/)

### Backend
- Server is hosted at: [https://content-editor-be.onrender.com](https://content-editor-be.onrender.com)
- **Note**: The server may be in sleep mode due to hosting restrictions. Initial requests might take longer to wake up the server.

## Option 2: Local Development Setup

### Backend Setup
1. Clone the backend repository:
   ```bash
   git clone [content-editor-be-repository-url]
   cd content-editor-be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3001` by default.

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone [content-editor-fe-repository-url]
   cd content-editor-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API endpoint:
   - Open `src/constants.ts`
   - Update the `API_HOST` constant:
     ```typescript
     export const API_HOST = "http://localhost:3001";
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Verifying the Setup
1. Both servers should be running without any errors in the console
2. Frontend should be able to communicate with the backend
3. Try performing a basic operation to ensure everything is working correctly
