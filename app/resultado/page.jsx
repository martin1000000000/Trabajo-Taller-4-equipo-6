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
          <h1 style={{ marginBottom: '1.25rem' } }>Explicación de la Metodología</h1>
          
          <p>
            Nuestro sistema analiza las <strong>4-6 frases que seleccionaste y el orden</strong> en que las priorizaste. 
            Cada frase tiene un "nivel de implicancia" o peso diferente para cada carrera, 
            permitiéndonos calcular una afinidad inicial.
          </p>
          
          <p>
            A veces, este cálculo puede resultar en empates entre carreras. Para resolver esto, aplicamos un 
            <strong> algoritmo de desempate de varios niveles</strong> que refina la puntuación basándose en 
            ponderaciones (Nivel 0), lógica simple (Nivel 1) y la posición de tus frases (Nivel 2).
          </p>

          <p>
            La efectividad de este método se validó con <strong>1 millón de simulaciones</strong>, 
            demostrando cómo se reducen drásticamente los empates en cada paso del algoritmo.
          </p>

          {/* --- Gráfico Añadido --- */}
          <div style={{ 
            width: '100%', 
            maxWidth: '550px', 
            margin: '20px auto', 
            padding: '10px', 
            background: '#ffffff', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
           
            <img 
              src="/reduccion_empates.png" 
              alt="Gráfico de Reducción de Empates del Algoritmo"
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: '4px' 
              }} 
            />
          </div>
          {/* --- Fin del Gráfico --- */}

          <p>
            Como muestra el gráfico, el algoritmo reduce los empates de un 45.09% inicial (450,895 casos) a solo un <strong>0.53%</strong> (5,344 casos), 
            asegurando que la carrera recomendada sea la más alineada con tus selecciones.
          </p>
          
          <button onClick={togglePlanPanel} className="plan-panel-close">
            Cerrar
          </button>
        </div>
      </div>
      {/* --- FIN: Panel de Metodología --- */}


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