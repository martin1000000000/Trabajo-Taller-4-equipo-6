"use client";
import { useEffect, useState } from "react";

export default function ResultadoPage() {
  const [resultado, setResultado] = useState(null);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("resultado");
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('Datos recibidos en resultado:', parsedData);
      setResultado(parsedData);
    }
  }, []);

  const togglePlanPanel = () => {
    setIsPlanOpen(!isPlanOpen);
  };

  if (!resultado) return (
    <main className="result-loading">
      <div className="result-loading-spinner"></div>
      <div className="result-loading-text">Analizando tus respuestas</div>
      <div className="result-loading-subtext">Calculando tus carreras ideales...</div>
    </main>
  );

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

      <div className={`plan-panel ${isPlanOpen ? 'open' : ''}`}>
        <div className="plan-panel-content">
          <h2>Ver metodologia</h2>
          <p>Nuestro programa funciona de tal manera que utilizamos las 4-6 frases que escogiste, junto con el posterior orden en el cual ubicaste cada una de ellas, para poder trazar lineas y conexiones que nos indiquen que carrera va mas acorde con tus selecciones. Nuestro sistema de trazado funciona de tal manera que cada frase tiene su nivel de implicancia en cada carrera.</p>
          <button onClick={togglePlanPanel} className="plan-panel-close">
            Cerrar
          </button>
        </div>
      </div>

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
              {`Afinidad: ${r.puntaje.toFixed(1)}%`}
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

      <div className="contenedor-botones-extremos">
        <button 
          className="Plan-button"
          onClick={togglePlanPanel}
        >
          Ver metodologia
        </button>
        <button 
          className="Metodologia-button"
        >
          Ver Plan de estudios 
        </button>
      </div>
    </main>
  );
}