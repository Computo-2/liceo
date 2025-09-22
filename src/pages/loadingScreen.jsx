import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Users, Award } from 'lucide-react';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

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
        return prev + 5; // 5% cada 100ms → duración total ~2s
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  useEffect(() => {
    setCurrentStep(Math.floor(progress / 25));
  }, [progress]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center z-50">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Progress Circle */}
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

          {/* Icon in center - sin pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CurrentIcon 
              size={32} 
              className="text-blue-600" 
              style={{ color: '#314e99' }}
            />
          </div>
        </div>

        {/* Educational Elements */}
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

        {/* Subtitle */}
        <p className="text-lg text-[#32509c] font-medium">
          PREPARANDO TU EXPERIENCIA...
        </p>
      </div>
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
