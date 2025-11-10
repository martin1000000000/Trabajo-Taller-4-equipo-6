
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 1. DEJA LA FUNCIÓN DE MEZCLAR AQUÍ
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
  const [rasgos, setRasgos] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch("/api/frases")
      .then(r => r.json())
      .then(data => {
        // 2. LLAMA A LA FUNCIÓN AQUÍ, DESPUÉS DE RECIBIR LOS DATOS
        setRasgos(mezclarArray(data)); 
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setSeleccionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setError("");
  };

  const siguientePaso = () => {
    if (seleccionadas.length < 4) {
      setError(`Debes seleccionar al menos 4 frases. Has seleccionado ${seleccionadas.length}.`);
      return;
    }
    setEnviando(true);
    sessionStorage.setItem("seleccionadas_temp", JSON.stringify(seleccionadas));
    router.push("/ordenar");
  };

  // ... (El resto de tu código HTML/JSX se mantiene igual) ...
  
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
              onClick={() => toggle(rasgo.id)} 
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


