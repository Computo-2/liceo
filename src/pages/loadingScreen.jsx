import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Bloquear scroll mientras carga
    document.body.style.overflow = 'hidden';

    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Después del fade out, ocultar completamente y restaurar scroll
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = 'unset';
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      // Limpiar el bloqueo de scroll al desmontar el componente
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ 
        background: 'linear-gradient(135deg, #314e99 0%, #4a6cb8 100%)',
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 text-center">
        {/* Logo con animación */}
        <div className="mb-8 animate-pulse">
          <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/TheLiceoLogo.png" 
              alt="El Liceo Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>

        {/* Texto de carga */}
        <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
          The liceo
        </h2>
        
        <p className="text-white/80 text-lg mb-8 animate-fade-in-delay">
          Cargando experiencia educativa...
        </p>

        {/* Barra de progreso animada */}
        <div className="w-64 mx-auto mb-8">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full animate-loading-bar origin-left"></div>
          </div>
        </div>

        {/* Spinner giratorio */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Efectos adicionales */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent"></div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: scaleX(0);
          }
          70% {
            transform: scaleX(0.7);
          }
          100% {
            transform: scaleX(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.5s both;
        }

        .animate-loading-bar {
          animation: loading-bar 3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;