import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Bloquear scroll mientras carga
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = 'unset';
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!loading) return null;

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

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-8 animate-pulse">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
            <img
              src="/TheLiceoLogo.png"
              alt="El Liceo Logo"
              className="w-4/5 h-4/5 object-contain"
            />
          </div>
        </div>

        {/* Texto */}
        <p className="text-white text-base sm:text-lg md:text-xl mb-8 animate-fade-in-delay">
          Cargando experiencia educativa...
        </p>

        {/* Barra de progreso */}
        <div className="w-11/12 sm:w-3/4 md:w-64 mx-auto mb-8">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full animate-loading-bar origin-left"></div>
          </div>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Efecto de fondo inferior */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent"></div>

      {/* Animaciones personalizadas */}
      <style jsx>{`
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
