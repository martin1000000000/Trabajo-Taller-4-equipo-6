"use client";
import React from 'react';

export default function EstadisticasPage() {
  return (
    <main className="resultado-container">
      <h1 className="resultado-title">Panorama Laboral 2025</h1>
      <p className="resultado-subtitle">
        {/* Servicio de Información de la Educación Superior de Chile (SIES)*/}
        Comparativa de Empleabilidad (1er año) vs Sueldo Promedio (4to año) según datos oficiales del SIES.
      </p>

      {/* Contenedor del Gráfico */}
      <div style={{ 
        margin: '40px auto', 
        maxWidth: '1000px',
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <img 
          src="/estadisticas02.png" 
          alt="Gráfico de Empleabilidad y Sueldos Ingeniería" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            borderRadius: '8px'
          }}
        />
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.85rem', 
          color: '#888', 
          marginTop: '15px',
          fontStyle: 'italic'
        }}>
          Fuente: Buscador de Empleabilidad e Ingresos SIES 2024-2025 (Mineduc)
        </p>
      </div>

      {/* Sección de Análisis de Datos */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 50px', 
        textAlign: 'left',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}>
        <h3 style={{ 
          color: '#0e2b5eff', 
          marginBottom: '15px', 
          fontSize: '1.4rem', 
          fontWeight: '700' 
        }}>
          ¿Qué nos dicen estos datos?
        </h3>
        
        <p style={{ color: '#0e2b5eff', lineHeight: '1.7', marginBottom: '15px' }}>
          El gráfico revela tres grupos claros en el panorama de las ingenierías en Chile:
        </p>
        
        <ul style={{ 
          listStyleType: 'none', 
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <li style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🚀</span>
            <span style={{ color: '#0e2b5eff' }}>
              <strong>Alta Demanda Digital:</strong> La <em>Ingeniería Civil Informática</em> lidera indiscutiblemente tanto en sueldos (cercanos a $2.4M) como en empleabilidad (90%), reflejando la necesidad crítica de tecnología.
            </span>
          </li>
          
          <li style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🏗️</span>
            <span style={{ color: '#0e2b5eff' }}>
              <strong>El Núcleo Industrial:</strong> Carreras como <em>Civil Industrial, Electrónica y Obras Civiles</em> se mantienen como opciones muy sólidas, con sueldos bordeando los $2M y alta estabilidad laboral.
            </span>
          </li>
          
          <li style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎨</span>
            <span style={{ color: '#0e2b5eff' }}>
              <strong>Nicho Creativo:</strong> Áreas como <em>Sonido</em> muestran un comportamiento diferente, priorizando la vocación artística, aunque con desafíos mayores en términos de inserción laboral inmediata y remuneración inicial comparada con las ingenierías duras.
            </span>
          </li>
        
             <li style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎨</span>
            <span style={{ color: "red" }}>
              <strong >OBS:</strong> Ingenieria Civil acustica no fue en encontrada en los datos citados por ello, como referencia se uso Ingenieria en Sonido. 
            </span>
          </li>
        </ul>
      </div>

      {/* --- ZONA DE BOTONES --- */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        flexWrap: 'wrap' 
      }}>
        {/* BOTÓN 1: VOLVER ATRÁS (A Resultados) */}
        <button 
          onClick={() => window.location.href = "/resultado"}
          className="btn-inicio"
        >
          Volver atrás
        </button>

        {/* BOTÓN 2: VOLVER AL INICIO (Home) */}
        <button 
          onClick={() => window.location.href = "/"}
          className="btn-inicio"
          style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }} // Un gris para diferenciarlo
        >
          Volver al Inicio
        </button>
      </div>

    </main>
  );
}