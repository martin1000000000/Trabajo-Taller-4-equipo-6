import { getSheetData } from '../../lib/googleSheets';

export default async function TestDBPage() {
  // NOTA: Usamos comillas simples dentro del string porque el nombre tiene espacio
  const datosRasgos = await getSheetData("'Hoja 1'!A:C");
  const datosCarreras = await getSheetData("'Hoja 2'!A:D");

  return (
    <div style={{ padding: '2rem', color: 'white', background: '#0f1c2a', minHeight: '100vh' }}>
      <h1>Prueba de Conexión a Google Sheets</h1>
      
      <h2>Datos de Hoja 1 (frases)</h2>
      <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
        {JSON.stringify(datosRasgos, null, 2)}
      </pre>

      <h2>Datos de Hoja 2 (Carreras)</h2>
      <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
        {JSON.stringify(datosCarreras, null, 2)}
      </pre>
    </div>
  );
}