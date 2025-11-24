"use client";
import { useRouter } from "next/navigation";
import { useLogger } from '../hooks/useLogger';

export default function Home() {
  const router = useRouter();
  const { logAction } = useLogger();

  const startTest = async () => {
    await logAction({
      action: 'TEST_START',
      pageFrom: '/',
      pageTo: '/test',
      additionalData: {
        testType: 'engineering_orientation',
        timestamp: new Date().toISOString()
      }
    });
    
    router.push("/test");
  };

  return (
    <main className="home-container">
      <div className="background-image"></div>
      <div className="overlay"></div>
      
      <div className="content">
        <div className="university-logo"></div>
        <h1 className="title">Ingenierías UACh</h1>
        <p className="subtitle">Tu futuro en ingeniería comienza aquí</p>
        
        <div className="description">
          Descubre tu ingeniería ideal a través de nuestro test de orientación. 
          Este prototipo te ayudará a identificar qué carrera de ingeniería se adapta 
          mejor a tus habilidades e intereses.
        </div>
        
        <button onClick={startTest} className="start-button">
          Iniciar Test
        </button>
      </div>
    </main>
  );
}