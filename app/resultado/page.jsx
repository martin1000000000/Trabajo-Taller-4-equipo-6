"use client";
import { useEffect, useState } from "react";

export default function ResultadoPage() {
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("resultado");
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('Datos recibidos en resultado:', parsedData); // Para debugging
      setResultado(parsedData);
    }
  }, []);

  if (!resultado) return (
    <main className="result-loading">
      <div className="result-loading-spinner"></div>
      <div className="result-loading-text">Analizando tus respuestas</div>
      <div className="result-loading-subtext">Calculando tus carreras ideales...</div>
    </main>
  );

  // Verificar si hay recomendaciones
  if (!resultado.recomendaciones || resultado.recomendaciones.length === 0) {
    return (
      <main className="resultado-container">
        <h1 className="resultado-title">No se encontraron recomendaciones</h1>
        <p className="resultado-subtitle">
          No se pudieron calcular carreras basadas en tus respuestas.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="btn-inicio"
        >
          Volver al Inicio
        </button>
      </main>
    );
  }

  return (
    <main className="resultado-container">
      <h1 className="resultado-title">Carreras más afines</h1>
      <p className="resultado-subtitle">
        Basado en tus respuestas, estas son las carreras que mejor se adaptan a tus intereses
      </p>

      <div className="podio">
        {resultado.recomendaciones.map((r, index) => (
          <div 
            key={r.id || index}
            className={`carrera-card ${
              index === 0 ? 'primero' : 
              index === 1 ? 'segundo' : 'tercero'
            }`}
          >
            <div className="numero-podio">
              {index + 1}°
            </div>
            
            <h3 className="nombre-carrera">
              {r.carrera.replace('Ingeniería en ', '').replace('Ingeniería ', '')}
            </h3>
            <p className="descripcion-carrera">{r.descripcion}</p>
            <div className="puntaje">
              {r.puntaje} punto{r.puntaje !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => window.location.href = "/"}
        className="btn-inicio"
      >
        Volver al Inicio
      </button>
    </main>
  );
}