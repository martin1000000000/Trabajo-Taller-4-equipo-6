"use client";
import { useEffect, useState } from "react";

// --- 1. CONFIGURACIÓN DE LOS ENLACES (IDs de la UACh) ---
const LINKS_MALLAS = {
  'informática': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1708', //arreglado
  'industrial': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1822', //arreglado
  'electrónica': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1736', //arreglado
  'construcción': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1737', //arreglado
  'obras civiles': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1704', //arreglao
  'mecánica': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1779',  //arreglado  
  'acústica': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1730',//arreglado  
  'naval': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1740', //arreglado
  'bachillerato': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1807',//arreglao
  'default': 'https://www.uach.cl/dw/admision/plandeestudio.php?car=1807' 
};

// --- 2. FUNCIÓN PARA ELEGIR EL LINK CORRECTO ---
const obtenerLinkCarrera = (nombreCarrera) => {
  // Convertimos a minúsculas y quitamos tildes para comparar fácil
  const nombreNormalizado = nombreCarrera.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (nombreNormalizado.includes('informatica')) return LINKS_MALLAS['informática'];
  if (nombreNormalizado.includes('industrial')) return LINKS_MALLAS['industrial'];
  if (nombreNormalizado.includes('electronica')) return LINKS_MALLAS['electrónica'];
  if (nombreNormalizado.includes('construccion')) return LINKS_MALLAS['construcción'];
  if (nombreNormalizado.includes('obras')) return LINKS_MALLAS['obras civiles'];
  if (nombreNormalizado.includes('mecanica')) return LINKS_MALLAS['mecánica'];
  if (nombreNormalizado.includes('acustica')) return LINKS_MALLAS['acústica'];
  if (nombreNormalizado.includes('naval')) return LINKS_MALLAS['naval'];
  if (nombreNormalizado.includes('bachillerato')) return LINKS_MALLAS['bachillerato'];
  
  return LINKS_MALLAS['default'];
};


export default function ResultadoPage() {
  const [resultado, setResultado] = useState(null);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("resultado");
    if (data) {
      const parsedData = JSON.parse(data);
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
      
      {/* --- Panel de Metodología --- */}
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
           Como muestra el gráfico, el algoritmo reduce los empates de un 45.09% inicial (450,895 casos) a solo un <strong>0.53%</strong> (5,344 casos), 
            asegurando que la carrera recomendada sea la más alineada con tus selecciones
          </p>
          
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
        {resultado.recomendaciones.map((r, index) => {
          // Calculamos el link específico para esta carrera
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
              
              {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
              {/* Se quitó el puntaje de afinidad y se puso el botón */}
              <a 
                href={linkMalla}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '8px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  borderRadius: '50px', // Bordes bien redondeados
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
              {/* --------------------------- */}

            </div>
          );
        })}
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
          Ver metodología
        </button>
        
        {/* Botón genérico de abajo (opcional, ya que arriba tienen los links específicos) */}
        <button 
          className="Metodologia-button"
          onClick={() => window.open("https://www.uach.cl/admision", "_blank")}
        >
          Ver admisión general
        </button>
      </div>
    </main>
  );
}