
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

// Cargar archivos
const carrerasPath = path.join(process.cwd(), 'data', 'carreras.json');
const frasesPath = path.join(process.cwd(), 'data', 'ver2.json');

const carreras = JSON.parse(readFileSync(carrerasPath, 'utf8'));
const rasgos = JSON.parse(readFileSync(frasesPath, 'utf8'));
      
// Mapeo de nombres
const mapeoCarreras = {
  "Informática": "Ingeniería en Informática",
  "Electrónica": "Ingeniería en Electrónica", 
  "Mecánica": "Ingeniería en Mecánica",
  "Acústica": "Ingeniería en Acústica",
  "Naval": "Ingeniería Naval",
  "Industrial": "Ingeniería Industrial",
  "Bachillerato": "Bachiller en Ingeniería",
  "Obras Civiles": "Ingeniería en Obras Civiles",
  "Construcción": "Ingeniería en Construcción",
  "Plan Común": "Plan Común"
};

function calcularPuntajesSimple(seleccionadas) {
  const puntajes = {};

  // Inicializar todas las carreras con 0
  Object.values(mapeoCarreras).forEach(carrera => {
    puntajes[carrera] = 0;
  }); 

  // Sumar puntos por cada rasgo seleccionado
  seleccionadas.forEach(id => {
    const rasgo = rasgos.find(r => r.id === id);
    if (rasgo && rasgo.carreras) {
      rasgo.carreras.forEach(carreraVer2 => {
        const carreraNombre = mapeoCarreras[carreraVer2];
        if (carreraNombre) {
          puntajes[carreraNombre]++;
        }
      });
    }
  });

  // Convertir a array de resultados
  return carreras.map(carrera => {
    const puntaje = puntajes[carrera.nombre] || 0;
    
    return {
      carrera: carrera.nombre,
      descripcion: carrera.desc,
      puntaje: puntaje,
      rasgosEspecificos: puntaje,
      perfil: obtenerPerfil(puntaje),
      id: carrera.id
    };
  });
}

function obtenerPerfil(puntaje) {
  if (puntaje >= 4) return "Muy definido";
  if (puntaje === 3) return "Definido";
  if (puntaje === 2) return "Interés moderado";
  if (puntaje === 1) return "Interés leve";
  return "Sin coincidencias";
}

export async function POST(request) {
  try {
    const { selected } = await request.json();

    if (!selected || !Array.isArray(selected)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    // VALIDAR MÍNIMO 4 FRASES
    if (selected.length < 4) {
      return NextResponse.json({ 
        error: `Debes seleccionar al menos 4 frases. Has seleccionado ${selected.length}.` 
      }, { status: 400 });
    }


    console.log('Rasgos seleccionados:', selected);

    const resultados = calcularPuntajesSimple(selected);

    console.log('Resultados calculados:', resultados);

    // Ordenar por puntaje descendente
    const recomendaciones = resultados
      .filter(r => r.puntaje > 0)
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 3);

    console.log('Recomendaciones finales:', recomendaciones);

    return NextResponse.json({
      recomendaciones: recomendaciones,
      totalSeleccionadas: selected.length,
      estadisticas: {
        totalCarrerasEvaluadas: resultados.length,
        carrerasConPuntaje: resultados.filter(r => r.puntaje > 0).length
      }
    });

  } catch (error) {
    console.error('Error en API recomendar:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}