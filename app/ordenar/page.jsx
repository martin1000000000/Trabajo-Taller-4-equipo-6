"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogger } from '../../hooks/useLogger';

export default function OrdenarPage() {
  const router = useRouter();
  const { logAction } = useLogger();
  const [frasesOrdenadas, setFrasesOrdenadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarSeleccion = async () => {
      const idsGuardados = JSON.parse(sessionStorage.getItem("seleccionadas_temp"));
      
      if (!idsGuardados || idsGuardados.length === 0) {
        router.push("/test");
        return;
      }

      try {
        const res = await fetch("/api/frases");
        const todasLasFrases = await res.json();
        
        const seleccionadasCompletas = idsGuardados
          .map(id => todasLasFrases.find(f => f.id === id))
          .filter(Boolean);
        
        setFrasesOrdenadas(seleccionadasCompletas);

        await logAction({
          action: 'TEST_ORDER_START',
          pageFrom: '/test',
          pageTo: '/ordenar',
          additionalData: {
            frasesCount: seleccionadasCompletas.length,
            frasesIds: idsGuardados,
            timestamp: new Date().toISOString()
          }
        });

      } catch (err) {
        setError("Error al cargar las frases. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    cargarSeleccion();
  }, [router, logAction]);

  const mover = async (index, direccion, frase) => {
    const nuevas = [...frasesOrdenadas];
    const [item] = nuevas.splice(index, 1);
    nuevas.splice(index + direccion, 0, item);
    setFrasesOrdenadas(nuevas);

    await logAction({
      action: 'TEST_REORDER',
      pageFrom: '/ordenar',
      pageTo: '/ordenar',
      additionalData: {
        fraseId: frase.id,
        fraseTexto: frase.rasgo,
        oldPosition: index + 1,
        newPosition: index + direccion + 1,
        direction: direccion > 0 ? 'down' : 'up',
        timestamp: new Date().toISOString()
      }
    });
  };

  const terminarTest = async () => {
    setEnviando(true);
    setError("");

    try {
      const orderedIds = frasesOrdenadas.map(f => f.id);
      
      await logAction({
        action: 'TEST_ORDER_COMPLETE',
        pageFrom: '/ordenar',
        pageTo: '/resultado',
        additionalData: {
          frasesCount: orderedIds.length,
          frasesOrdenadas: orderedIds,
          ordenFinal: frasesOrdenadas.map((f, i) => ({
            position: i + 1,
            id: f.id,
            texto: f.rasgo
          })),
          timestamp: new Date().toISOString()
        }
      });

      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedOrdered: orderedIds })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error del servidor al calcular");
      }

      await logAction({
        action: 'TEST_COMPLETE',
        pageFrom: '/ordenar',
        pageTo: '/resultado',
        additionalData: {
          carrerasRecomendadas: data.recomendaciones?.map(r => r.carrera) || [],
          timestamp: new Date().toISOString()
        }
      });

      sessionStorage.setItem("resultado", JSON.stringify(data));
      sessionStorage.removeItem("seleccionadas_temp");
      
      router.push("/resultado");

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || "Error de conexión");
      
      await logAction({
        action: 'TEST_ERROR',
        pageFrom: '/ordenar',
        pageTo: '/ordenar',
        additionalData: {
          error: err.message,
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return (
    <main className="loading-container floating-particles">
      <div className="loading-spinner"></div>
      <div className="loading-text">Cargando tu selección...</div>
    </main>
  );

  return (
    <div className="page-background">
      <main className="test-container">
        <h2 className="test-title">Ordena tus frases por importancia</h2>
        <p className="test-subtitle" style={{color: 'black'}}>
          Ordena las frases escogidas en orden descendente. Primero la que MÁS te identifica (Top 1).
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

        <div style={{ 
          maxWidth: '800px', 
          margin: '2rem auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px' 
        }}>
          {frasesOrdenadas.map((frase, index) => (
            <div key={frase.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '15px',
              borderRadius: '10px',
              border: index === 0 ? '3px solid #FF6A21' : '1px solid #ddd',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
             }}>
              <div style={{ 
                fontWeight: 'bold', 
                color: '#FF6A21', 
                fontSize: '1.5rem',
                fontFamily: 'sans-serif',
                minWidth: '40px',
                textAlign: 'center'
              }}>
                #{index + 1}
              </div>
              <div style={{ flex: 1, textAlign: 'left', color: '#334155', fontSize: '1.1rem' }}>
                {frase.rasgo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button 
                  onClick={() => mover(index, -1, frase)} 
                  disabled={index === 0 || enviando}
                  style={{ cursor: 'pointer', padding: '5px 10px', opacity: index === 0 ? 0.3 : 1 }}>
                  ⬆️
                </button>
                <button 
                  onClick={() => mover(index, 1, frase)} 
                  disabled={index === frasesOrdenadas.length - 1 || enviando}
                  style={{ cursor: 'pointer', padding: '5px 10px', opacity: index === frasesOrdenadas.length - 1 ? 0.3 : 1 }}>
                  ⬇️
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={terminarTest} 
          className="terminar-button" 
          disabled={enviando}
          style={{ opacity: enviando ? 0.6 : 1 }}
        >
          {enviando ? "Calculando..." : "Terminar Test y Ver Resultados"}
        </button>
      </main>
    </div>
  );
}