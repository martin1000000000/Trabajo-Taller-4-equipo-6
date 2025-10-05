
"use client";
import { useEffect, useState } from "react";

function mezclarArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TestPage(){
  const [rasgos, setRasgos] = useState([]);
  const [rasgosMezclados, setRasgosMezclados] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch("/api/frases")
      .then(r => r.json())
      .then(data => {
        setRasgos(data);
        setRasgosMezclados(mezclarArray(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setSeleccionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setError("");
  };

  const terminar = async () => {
    if (seleccionadas.length < 4) {
      setError(`Debes seleccionar al menos 4 frases. Has seleccionado ${seleccionadas.length}.`);
      return;
    }

    setEnviando(true);
    setError("");

    try {
      console.log('Enviando:', seleccionadas);
      
      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: seleccionadas })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error del servidor");
      }

      console.log('Éxito:', data);
      sessionStorage.setItem("resultado", JSON.stringify(data));
      window.location.href = "/resultado";
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || "Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return (
    <main className="loading-container floating-particles">
      <div className="loading-spinner"></div>
      <div className="loading-text">Cargando rasgos</div>
      <div className="loading-subtext">Preparando tu test personalizado...</div>
    </main>
  );

  const puedeEnviar = seleccionadas.length >= 4 && seleccionadas.length <= 6 && !enviando;
  
  return (
    <div className="page-background">
      <main className="test-container">
        <h2 className="test-title">Selecciona las frases que más te representen</h2>
        <p className="test-subtitle">
          Haz clic en las frases para seleccionarlas. Las frases seleccionadas cambian de color. Puedes escoger entre 4 y 6 frases.
        </p>
        
        <div className="selection-counter">
          {seleccionadas.length} frase{seleccionadas.length !== 1 ? 's' : ''} seleccionada{seleccionadas.length !== 1 ? 's' : ''}
          {seleccionadas.length < 4 && (
            <span style={{color: 'red', marginLeft: '10px', fontSize: '14px'}}>
              (Mínimo 4 requeridas)
            </span>
          )}
        </div>

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
          {rasgosMezclados.map(rasgo => (
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
            onClick={terminar} 
            className="terminar-button"
            disabled={!puedeEnviar}
            style={{ 
              opacity: puedeEnviar ? 1 : 0.6,
              cursor: puedeEnviar ? 'pointer' : 'not-allowed'
            }}
          >
            {enviando ? 'Procesando...' : 
             seleccionadas.length < 4 ? `Selecciona ${4 - seleccionadas.length} más` : 
             'Terminar Test'}
          </button>
        </div>
      </main>
    </div>
  );
}
