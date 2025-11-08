import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

// 1. ESTE ES EL MAPA "TRADUCTOR" QUE FALTABA
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
  "Plan Común": "Bachiller en Ingeniería" 
};

function generarEscalaPorcentual(k) {
  let sumaTotal = (k * (k + 1)) / 2;
  if (sumaTotal === 0) return Array(k).fill(0);
  
  let escala = [];
  for (let i = k; i >= 1; i--) {
    escala.push((i / sumaTotal) * 100.0);
  }
  return escala;
}

export async function POST(request) {
  try {
    const { selectedOrdered } = await request.json();

    if (!selectedOrdered || !Array.isArray(selectedOrdered) || selectedOrdered.length < 4) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const rasgosRaw = await getSheetData("'Hoja 1'!A:C");
    const carrerasRaw = await getSheetData("'Hoja 2'!A:D"); 

    if (!rasgosRaw.length || !carrerasRaw.length) {
       return NextResponse.json({ error: "Error al leer la base de datos" }, { status: 500 });
    }

    const dataRasgos = rasgosRaw.slice(1);
    const dataCarreras = carrerasRaw.slice(1);

    const rasgosDb = dataRasgos.map(fila => ({
        id: Number(fila[0]),
        rasgo: fila[1],
        carreras: fila[2] ? fila[2].split(',').map(c => c.trim()) : []
    }));
    
    const carrerasDb = dataCarreras.map(fila => ({
        id: Number(fila[0]),
        nombre: fila[1],
        desc: fila[2],
        keywords: fila[3] ? fila[3].split(',').map(k => k.trim()) : []
    }));

    const rasgosMap = new Map(rasgosDb.map(r => [r.id, r]));

    const rasgosOrdenadosUsuario = selectedOrdered
      .map(id => rasgosMap.get(id))
      .filter(Boolean);

    const k = rasgosOrdenadosUsuario.length;
    const escalaCalculo = generarEscalaPorcentual(k);

    let pPonderados = {};
    let pSimples = {};
    let posAlcanza2 = {};
    let acumuladoSimple = {};

    carrerasDb.forEach(c => {
        pPonderados[c.nombre] = 0.0;
        pSimples[c.nombre] = 0;
        posAlcanza2[c.nombre] = k + 1;
        acumuladoSimple[c.nombre] = 0;
    });

    rasgosOrdenadosUsuario.forEach((rasgo, index) => {
        const pesoActual = escalaCalculo[index] || 0;
        
        // 2. TRADUCIMOS LOS NOMBRES CORTOS A LARGOS
        const carrerasRasgo = rasgo.carreras.map(corta => mapeoCarreras[corta]).filter(Boolean);

        if (carrerasRasgo.length === 2 && carrerasRasgo[0] === carrerasRasgo[1]) {
             const cNombre = carrerasRasgo[0];
             if (pPonderados.hasOwnProperty(cNombre)) {
                 pPonderados[cNombre] += pesoActual;
                 pSimples[cNombre] += 2;
                 acumuladoSimple[cNombre] += 2;
                 if (acumuladoSimple[cNombre] >= 2 && posAlcanza2[cNombre] > k) {
                     posAlcanza2[cNombre] = index;
                 }
             }
        } else if (carrerasRasgo.length > 0) {
            const puntajeDividido = pesoActual / carrerasRasgo.length;
            carrerasRasgo.forEach(cNombre => {
                if (pPonderados.hasOwnProperty(cNombre)) {
                    pPonderados[cNombre] += puntajeDividido;
                    pSimples[cNombre] += 1;
                    acumuladoSimple[cNombre] += 1;
                    if (acumuladoSimple[cNombre] >= 2 && posAlcanza2[cNombre] > k) {
                        posAlcanza2[cNombre] = index;
                    }
                }
            });
        }
    });

    const resultadosFinales = carrerasDb.map(c => ({
        carrera: c.nombre,
        descripcion: c.desc,
        id: c.id,
        puntaje: pPonderados[c.nombre],
        _scoreSimple: pSimples[c.nombre],
        _posAlcanza2: posAlcanza2[c.nombre]
    }))
    .filter(r => r.puntaje > 0.001)
    .sort((a, b) => {
        if (Math.abs(b.puntaje - a. puntaje) > 0.0001) {
            return b.puntaje - a.puntaje;
        }
        if (b._scoreSimple !== a._scoreSimple) {
            return b._scoreSimple - a._scoreSimple;
        }
        return a._posAlcanza2 - b._posAlcanza2;
    });

    const recomendaciones = resultadosFinales.slice(0, 3).map(r => ({
        id: r.id,
        carrera: r.carrera,
        descripcion: r.descripcion,
        puntaje: r.puntaje
    }));

    return NextResponse.json({
      recomendaciones: recomendaciones,
    });

  } catch (error) {
    console.error('Error en API recomendar:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}