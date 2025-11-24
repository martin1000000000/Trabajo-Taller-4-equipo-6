import { NextResponse } from 'next/server';
import { logUserAction } from '@/lib/googleSheets';

export async function POST(request) {
  try {
    const logData = await request.json();
    
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    const enhancedLogData = {
      ...logData,
      userAgent,
      ipAddress,
      timestamp: new Date().toISOString()
    };

    await logUserAction(enhancedLogData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Log registrado correctamente' 
    });
  } catch (error) {
    console.error('Error en API de log:', error);
    return NextResponse.json(
      { success: false, error: 'Error al registrar log' },
      { status: 500 }
    );
  }
}