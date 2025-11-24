"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogger } from '../../hooks/useLogger';

function mezclarArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TestPage(){
  const router = useRouter();
  const { logAction } = useLogger();
  const [rasgos, setRasgos] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch("/api/frases")
      .then(r => r.json())
      .then(data => {
        setRasgos(mezclarArray(data)); 
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id, rasgo) => {
    const wasSelected = seleccionadas.includes(id);
    const newSelection = wasSelected 
      ? seleccionadas.filter(x => x !== id) 
      : [...seleccionadas, id];
    
    setSeleccionadas(newSelection);
    setError("");

    await logAction({
      action: 'TEST_SELECTION',
      pageFrom: '/test',
      pageTo: '/test',
      additionalData: {
        fraseId: id,
        fraseTexto: rasgo,
        action: wasSelected ? 'deselected' : 'selected',
        totalSeleccionadas: newSelection.length,
        timestamp: new Date().toISOString()
      }
    });
  };

  const siguientePaso = async () => {
    if (seleccionadas.length < 4) {
      setError(`Debes seleccionar al menos 4 frases. Has seleccionado ${seleccionadas.length}.`);
      return;
    }
    
    setEnviando(true);
    
    await logAction({
      action: 'TEST_SELECTION_COMPLETE',
      pageFrom: '/test',
      pageTo: '/ordenar',
      additionalData: {
        totalFrasesSeleccionadas: seleccionadas.length,
        frasesIds: seleccionadas,
        timestamp: new Date().toISOString()
      }
    });
    
    sessionStorage.setItem("seleccionadas_temp", JSON.stringify(seleccionadas));
    router.push("/ordenar");
  };

  if (loading) return (
    <main className="loading-container floating-particles">
      <div className="loading-spinner"></div>
      <div className="loading-text">Cargando rasgos...</div>
      <div className="loading-subtext">Preparando tu test personalizado...</div>
    </main>
  );

  const puedeEnviar = seleccionadas.length >= 4 && seleccionadas.length <= 6 && !enviando;

  return (
    <div className="page-background">
      <main className="test-container">
        <h2 className="test-title">Selecciona las frases que más te representen</h2>
        <p className="test-subtitle">
          Haz clic en las frases para seleccionarlas. Puedes escoger entre 4 y 6 frases.
        </p>
     
        {error && (
          <div style={{
            color: 'red', 
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '5px',
            margin: '10px 0',
            textAlign: 'center',
            border: '1px solid #ffcccc'
          }}>
            {error}
          </div>
        )}
        
        <div className="frases-grid">
          {rasgos.map(rasgo => (
            <button 
              key={rasgo.id} 
              onClick={() => toggle(rasgo.id, rasgo.rasgo)} 
              className={`frase-button ${seleccionadas.includes(rasgo.id) ? 'selected' : ''}`}
              disabled={enviando}
            >
              {rasgo.rasgo}
            </button>
          ))}
        </div>

        <div>
          <button 
            onClick={siguientePaso}
            className="terminar-button"
            disabled={!puedeEnviar}
            style={{ 
              opacity: puedeEnviar ? 1 : 0.6,
              cursor: puedeEnviar ? 'pointer' : 'not-allowed'
            }}
          >
            {enviando ? 'Cargando...' : 
             seleccionadas.length < 4 ? `Selecciona ${4 - seleccionadas.length} más` : 
             'Siguiente (Ordenar)'}
          </button>
        </div>
      </main>
    </div>
  );
}