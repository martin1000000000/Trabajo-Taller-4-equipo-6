import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

// Cargar el nuevo archivo ver2.json
const frasesPath = path.join(process.cwd(), 'data', 'ver2.json');
const rasgos = JSON.parse(readFileSync(frasesPath, 'utf8'));

export async function GET() {
  return NextResponse.json(rasgos);  DFDFD
}
