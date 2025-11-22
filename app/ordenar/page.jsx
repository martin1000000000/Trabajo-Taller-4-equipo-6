
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
   
export default function OrdenarPage() {
  const router = useRouter();
  const [frasesOrdenadas, setFrasesOrdenadas] = useState([]); // Almacenará los objetos de frases (id, rasgo)
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarSeleccion = async () => {
      // 1. Leer los IDs que guardamos en la página de test
      const idsGuardados = JSON.parse(sessionStorage.getItem("seleccionadas_temp"));
      
      // Si no hay nada, o el usuario recargó, lo mandamos de vuelta al test
      if (!idsGuardados || idsGuardados.length === 0) {
        router.push("/test");
        return;
      }

      try {
        // 2. Necesitamos los textos de esos IDs, así que llamamos a /api/frases
        const res = await fetch("/api/frases");
        const todasLasFrases = await res.json();
        
        // 3. Filtramos la lista completa para quedarnos solo con las que seleccionó el usuario
        const seleccionadasCompletas = idsGuardados
          .map(id => todasLasFrases.find(f => f.id === id))
          .filter(Boolean); // .filter(Boolean) elimina cualquier 'undefined' si algo falló
        
        setFrasesOrdenadas(seleccionadasCompletas);

      } catch (err) {
        setError("Error al cargar las frases. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    cargarSeleccion();
  }, [router]); // Se ejecuta solo una vez al cargar la página

  // Función para mover un ítem en la lista
  const mover = (index, direccion) => {
    const nuevas = [...frasesOrdenadas];
    const [item] = nuevas.splice(index, 1);
    nuevas.splice(index + direccion, 0, item);
    setFrasesOrdenadas(nuevas);
  };

  // 4. Esta es la función CLAVE: envía el orden a la API de recomendar
  const terminarTest = async () => {
    setEnviando(true);
    setError("");

    try {
      // 5. Convertimos los objetos de frase de nuevo a solo IDs, pero en el nuevo orden
      const orderedIds = frasesOrdenadas.map(f => f.id);
      
      // 6. Enviamos los IDs ordenados a la API de recomendación
      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedOrdered: orderedIds })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error del servidor al calcular");
      }

      // 7. Guardamos el resultado FINAL para la página de resultados
      sessionStorage.setItem("resultado", JSON.stringify(data));
      sessionStorage.removeItem("seleccionadas_temp"); // Limpiamos la selección temporal
      
      // 8. Enviamos al usuario a la página final
      router.push("/resultado");

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

        {/* Esta es la lista ordenable */}
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
                  onClick={() => mover(index, -1)} 
                  disabled={index === 0 || enviando}
                  style={{ cursor: 'pointer', padding: '5px 10px', opacity: index === 0 ? 0.3 : 1 }}>
                  ⬆️
                </button>
                <button 
                  onClick={() => mover(index, 1)} 
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