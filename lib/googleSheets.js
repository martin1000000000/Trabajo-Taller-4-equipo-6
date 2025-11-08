// lib/googleSheets.js
import { google } from 'googleapis';

export async function getSheetData(rangeName) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL, // Nota el cambio de nombre si usaste otro en .env
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID, // Nota el cambio de nombre si usaste otro en .env
      range: rangeName,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`Error conectando a Google Sheets (${rangeName}):`, error.message);
    return [];
  }
} 
