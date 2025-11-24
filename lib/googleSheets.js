import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getSheetData(range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error;
  }
}

export async function logUserAction(logData) {
  try {
    const SPREADSHEET_ID_LOGS = process.env.GOOGLE_SHEET_ID_LOGS || process.env.GOOGLE_SHEET_ID;
    
    const timestamp = new Date().toLocaleString('es-CL', { 
      timeZone: 'America/Santiago' 
    });

    const values = [
      [
        timestamp,
        logData.userId || 'anonymous',
        logData.action,
        logData.pageFrom || '',
        logData.pageTo || '',
        logData.userAgent || '',
        logData.ipAddress || '',
        JSON.stringify(logData.additionalData || {})
      ]
    ];

    const request = {
      spreadsheetId: SPREADSHEET_ID_LOGS,
      range: 'Logs!A:H',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    };

    const response = await sheets.spreadsheets.values.append(request);
    return response.data;
  } catch (error) {
    console.error('Error al registrar en Google Sheets:', error);
    throw error;
  }
}