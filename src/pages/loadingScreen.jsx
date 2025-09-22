import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Users, Award } from 'lucide-react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const steps = [
    { icon: BookOpen },
    { icon: Users },
    { icon: GraduationCap },
    { icon: Award }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadComplete && onLoadComplete(), 500);
          return 100;
        }
        return prev + 5; // Incremento más rápido para 2 segundos
      });
    }, 100); // Intervalo para completar en ~2 segundos

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  useEffect(() => {
    setCurrentStep(Math.floor(progress / 25));
  }, [progress]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center z-50">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Logo Container - Sin fondo y mucho más grande */}
        <div className="mb-16 relative">
          <div className="w-80 h-80 mx-auto flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/TheLiceoLogo.png" 
              alt="The Liceo Logo" 
              className="w-72 h-72 object-contain"
            />
          </div>
          
          {/* Animated rings around logo - mucho más grandes */}
          <div className="absolute inset-0 w-80 h-80 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border-2 border-blue-300 rounded-full animate-ping opacity-30 animation-delay-200"></div>
          </div>
        </div>

        {/* Progress Circle - más grande */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 24 24">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="rgba(49, 78, 153, 0.2)" 
              strokeWidth="2" 
              fill="none"
            />
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="#314e99" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray="62.83"
              strokeDashoffset={62.83 - (62.83 * progress) / 100}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          
          {/* Icon in center - sin pulse y más grande */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CurrentIcon 
              size={32} 
              className="text-blue-600" 
              style={{ color: '#314e99' }}
            />
          </div>
        </div>

        {/* Educational Elements - más grandes */}
        <div className="flex justify-center space-x-6 opacity-60 mb-6">
          {[BookOpen, Users, GraduationCap, Award].map((Icon, index) => (
            <Icon 
              key={index}
              size={28} 
              className={`transition-all duration-300 ${
                index <= currentStep ? 'text-blue-600 scale-110' : 'text-gray-400'
              }`}
              style={{ color: index <= currentStep ? '#314e99' : undefined }}
            />
          ))}
        </div>

        {/* Subtitle - más grande */}
        <p className="text-lg text-black-500 font-medium">
          PREPARANDO TU EXPERIENCIA...
        </p>
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

// Ejemplo de implementación completa
export default function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a The Liceo!</h1>
        <p className="text-xl text-gray-600">La carga ha terminado exitosamente.</p>
      </div>
    </div>
  );
}