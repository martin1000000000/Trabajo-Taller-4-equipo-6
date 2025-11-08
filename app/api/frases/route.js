import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const dataRaw = await getSheetData("'Hoja 1'!A:C");

    if (!dataRaw || dataRaw.length < 2) {
       return NextResponse.json([]);
    }

    const dataRows = dataRaw.slice(1);

    const frasesFormateadas = dataRows.map(fila => ({
      id: Number(fila[0]),
      rasgo: fila[1],
      carreras: fila[2] ? fila[2].split(',').map(c => c.trim()) : []
    }));

    return NextResponse.json(frasesFormateadas);

  } catch (error) {
    console.error("Error en api/frases:", error);
    return NextResponse.json({ error: "Error al leer los datos" }, { status: 500 });
  }
}