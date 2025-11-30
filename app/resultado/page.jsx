"use client";
import { useEffect, useState } from "react";

// --- 1. CONFIGURACIÓN DE LOS ENLACES ---
const LINKS_MALLAS = {
  'informática': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1708',
  'industrial': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1822',
  'electrónica': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1736',
  'construcción': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1737',
  'obras civiles': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1704',
  'mecánica': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1779',
  'acústica': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1730',
  'naval': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1740',
  'default': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1807' 
};

// --- 2. FUNCIÓN PARA ELEGIR EL LINK CORRECTO ---
const obtenerLinkCarrera = (nombreCarrera) => {
  const nombreNormalizado = nombreCarrera.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (nombreNormalizado.includes('informatica')) return LINKS_MALLAS['informática'];
  if (nombreNormalizado.includes('industrial')) return LINKS_MALLAS['industrial'];
  if (nombreNormalizado.includes('electronica')) return LINKS_MALLAS['electrónica'];
  if (nombreNormalizado.includes('construccion')) return LINKS_MALLAS['construcción'];
  if (nombreNormalizado.includes('obras')) return LINKS_MALLAS['obras civiles'];
  if (nombreNormalizado.includes('mecanica')) return LINKS_MALLAS['mecánica'];
  if (nombreNormalizado.includes('acustica')) return LINKS_MALLAS['acústica'];
  if (nombreNormalizado.includes('naval')) return LINKS_MALLAS['naval'];
  
  return LINKS_MALLAS['default'];
};

// --- 3. SUB-COMPONENTE: VISUALIZADOR DE METODOLOGÍA (DISEÑO TARJETA) ---
// --- 3. SUB-COMPONENTE: VISUALIZADOR DE METODOLOGÍA (LÓGICA REAL) ---
const AlgoritmoVisualizer = ({ onVolver }) => {
  const [paso, setPaso] = useState(0);

  const pasos = [
    {
      titulo: "1. Pesos de Porcentajes",
      texto: " Ejemplo: Eliges 4 frases, la primera vale exactamente el 40% del total y la última solo el 10%.",
      visual: (
        <div className="vis-chart-container">
          <div className="vis-bar-group">
            <div className="vis-bar" style={{height: '100%', background: '#6c5ce7'}}>40%</div>
            <span className="vis-label">Prio 1</span>
          </div>
          <div className="vis-bar-group">
            <div className="vis-bar" style={{height: '75%', background: '#a29bfe'}}>30%</div>
            <span className="vis-label">Prio 2</span>
          </div>
          <div className="vis-bar-group">
            <div className="vis-bar" style={{height: '50%', background: '#74b9ff'}}>20%</div>
            <span className="vis-label">Prio 3</span>
          </div>
          <div className="vis-bar-group">
            <div className="vis-bar" style={{height: '25%', background: '#dfe6e9'}}>10%</div>
            <span className="vis-label">Prio 4</span>
          </div>
        </div>
      )
    },
    {
      titulo: "2. Frases Diferenciadas",
      texto: "Existen dos tipos de frases, unas específicas para una carrera y otras que pueden aplicar a mas de una. Esto afecta considerablemente al porcentaje de ponderación",
      visual: (
        <div className="vis-split-container">
          {/* Caso Fuerte */}
          <div className="vis-flow-row">
            <div className="vis-node source">Frase A</div>
            <div className="vis-arrow-solid">➜ 100%</div>
            <div className="vis-node target-strong">Informática</div>
          </div>
          {/* Caso Dividido */}
          <div className="vis-flow-row mt-2">
            <div className="vis-node source">Frase B</div>
            <div className="vis-arrow-split">
              <span className="split-line top">50% ➜ Mecánica</span>
              <span className="split-line bot">50% ➜ Naval</span>
            </div>
          </div>
        </div>
      )
    },
    {
      titulo: "3. Desempate por Prioridad",
      texto: "Cuando dos carreras empatan en todo, el sistema se fija en cuál de las dos 'llegó a la meta' antes. Al bajar por tu lista ordenada, gana la carrera que consiguió sus puntos con tus primeras opciones, por encima de la que tuvo que esperar hasta el final de la lista para sumar lo mismo",
      visual: (
        <div className="vis-race-track">
          <div className="vis-track-lane">
            <span className="lane-label">Informática</span>
            <div className="lane-progress winner" style={{width: '90%'}}>
              <span className="runner">🚀 Prioridad 1</span>
            </div>
          </div>
          <div className="vis-track-lane">
            <span className="lane-label">Obras Civiles</span>
            <div className="lane-progress loser" style={{width: '50%'}}>
              <span className="runner">🐌 Prioridad 3</span>
            </div>
          </div>
        </div>
      )
    }
  
  ];

  return (
    <div className="tutorial-card">
      <div className="tutorial-header">
        <h3 className="tutorial-title">{pasos[paso].titulo}</h3>
        <span className="tutorial-step-counter">
          Paso {paso + 1} de {pasos.length}
        </span>
      </div>

      <div className="tutorial-body">
        <div className="tutorial-visual-area">
          {pasos[paso].visual}
        </div>
        <div className="tutorial-text-area">
          <p>{pasos[paso].texto}</p>
        </div>
      </div>

      <div className="tutorial-footer">
        <div className="tutorial-nav-buttons">
          <button 
            onClick={() => setPaso(p => Math.max(0, p - 1))} 
            disabled={paso === 0}
            className="btn-nav btn-secondary"
          >
            Anterior
          </button>
          
          {paso < pasos.length - 1 ? (
            <button 
              onClick={() => setPaso(p => Math.min(pasos.length - 1, p + 1))}
              className="btn-nav btn-primary"
            >
              Siguiente
            </button>
          ) : (
            <button onClick={onVolver} className="btn-nav btn-finish">
              Entendido
            </button>
          )}
        </div>
        
        <button onClick={onVolver} className="btn-link-back">
          Volver a la metodología
        </button>
      </div>
    </div>
  );
};

// --- 4. COMPONENTE PRINCIPAL ---
export default function ResultadoPage() {
  const [resultado, setResultado] = useState(null);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false); // Estado para cambiar vista

  useEffect(() => {
    const data = sessionStorage.getItem("resultado");
    if (data) {
      const parsedData = JSON.parse(data);
      setResultado(parsedData);
    }
  }, []);

  const registrarLog = async (accion) => {
    try {
      await fetch('/api/log', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: accion,
          detalles: resultado?.recomendaciones?.[0]?.carrera || 'Sin datos'
        }),
      });
      console.log(`Log enviado a /api/log: ${accion}`);
    } catch (error) {
      console.error("Error al registrar log:", error);
    }
  };

  const togglePlanPanel = () => {
    const nuevoEstado = !isPlanOpen;
    setIsPlanOpen(nuevoEstado);

    if (nuevoEstado) {
      registrarLog("VER_METODOLOGIA");
    } else {
      // Al cerrar, reseteamos la vista a texto para la próxima vez
      setTimeout(() => setShowInteractive(false), 300);
    }
  };

  const handleVerEstadisticas = () => {
    registrarLog("CLICK_ESTADISTICAS");
    setTimeout(() => {
        window.location.href = "/estadisticas";
    }, 150);
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
        <button onClick={() => window.location.href = "/"} className="btn-inicio">
          Volver al Inicio
        </button>
      </main>
    );
  }
  
  return (
    <main className="resultado-container">
      
      {/* --- Panel de Metodología --- */}
      <div className={`plan-panel ${isPlanOpen ? 'open' : ''}`}>
        <div className="plan-panel-content">
          
          {/* AQUÍ DECIDIMOS QUÉ MOSTRAR: ¿VISUALIZADOR O TEXTO? */}
          {showInteractive ? (
             <AlgoritmoVisualizer onVolver={() => setShowInteractive(false)} />
          ) : (
            <>
              <h1 style={{ marginBottom: '1.25rem' } }>Explicación de la Metodología</h1>
              
              <p>
                Nuestro sistema analiza las <strong>4-6 frases que seleccionaste y el orden</strong> en que las priorizaste. 
                Cada frase tiene un "nivel de implicancia" o peso diferente para cada carrera.
              </p>

              {/* BOTÓN MAGICO PARA VER LA ANIMACIÓN */}
              <button 
                onClick={() => setShowInteractive(true)}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#6c5ce7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  margin: '20px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>▶️</span> Ver explicación paso a paso
              </button>

              <p>
                A veces, este cálculo puede resultar en empates entre carreras. Para resolver esto, aplicamos un 
                <strong> algoritmo de desempate de varios niveles</strong> que refina la puntuación.
              </p>

              <div style={{ 
                width: '100%', maxWidth: '550px', margin: '20px auto', 
                padding: '10px', background: '#ffffff', 
                borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <img 
                  src="/reduccion_empates.png" 
                  alt="Gráfico de Reducción de Empates"
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
                />
              </div>

              <p>
                Como muestra el gráfico, el algoritmo reduce los empates drásticamente, 
                asegurando que la carrera recomendada sea la más alineada con tus selecciones.
              </p>
              
              <button onClick={togglePlanPanel} className="plan-panel-close">
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>

      <h1 className="resultado-title">Carreras más afines</h1>
      <p className="resultado-subtitle">
        Basado en tus respuestas, estas son las carreras que mejor se adaptan a tus intereses
      </p>

      <div className="podio">
        {resultado.recomendaciones.map((r, index) => {
          const linkMalla = obtenerLinkCarrera(r.carrera);
          
          return (
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
              
              <a 
                href={linkMalla}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registrarLog(`CLICK_MALLA_${r.carrera.replace(/ /g, '_').toUpperCase()}`)}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '8px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              >
                Ver Plan de Estudios ➜
              </a>
            </div>
          );
        })}
      </div>

      <button onClick={() => window.location.href = "/"} className="btn-inicio">
        Volver al Inicio
      </button>

      <div className="contenedor-botones-extremos">
        <button className="Plan-button" onClick={togglePlanPanel}>
          Ver metodología
        </button>
        <button className="Metodologia-button" onClick={handleVerEstadisticas}>
          Ver estadísticas laborales
        </button>
      </div>
    </main>
  );
}