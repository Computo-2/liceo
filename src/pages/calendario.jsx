import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Phone, Mail, X, Check } from 'lucide-react';
import '../styles/global.css';

const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    correo: ''
  });

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Obtener el primer día del mes y el número de días
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // Generar días del calendario
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Solo mostrar días del mes actual
    if (date.getMonth() === currentDate.getMonth()) {
      calendarDays.push(date);
    } else {
      calendarDays.push(null);
    }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isWeekend = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Domingo (0) y Sábado (6)
  };

  const isPastDate = (date) => {
    return date < today;
  };

  const isDisabled = (date) => {
    return isWeekend(date) || isPastDate(date);
  };

  const handleDateClick = (date) => {
    if (!date || isDisabled(date)) return;
    
    setSelectedDate(date);
    setShowForm(true);
    
    // Si ya hay una cita, cargar los datos
    const dateKey = date.toISOString().split('T')[0];
    if (appointments[dateKey]) {
      setFormData(appointments[dateKey]);
    } else {
      setFormData({ nombre: '', celular: '', correo: '' });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim() || !formData.celular.trim() || !formData.correo.trim()) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const dateKey = selectedDate.toISOString().split('T')[0];
    setAppointments({
      ...appointments,
      [dateKey]: { ...formData }
    });

    setShowForm(false);
    setSelectedDate(null);
    setFormData({ nombre: '', celular: '', correo: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedDate(null);
    setFormData({ nombre: '', celular: '', correo: '' });
  };

  const hasAppointment = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return appointments[dateKey];
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header del calendario */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center space-x-2">
            <Calendar size={20} />
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 bg-gray-50">
        {dayNames.map((day, index) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 bg-white">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-3 h-12"></div>;
          }

          const disabled = isDisabled(date);
          const hasAppt = hasAppointment(date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={`
                p-3 h-12 text-sm border border-gray-100 transition-colors relative
                ${disabled 
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                  : 'text-gray-900 hover:bg-blue-50 cursor-pointer'
                }
                ${hasAppt ? 'bg-green-100 text-green-800 font-semibold' : ''}
              `}
            >
              {date.getDate()}
              {hasAppt && (
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Formulario modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Agendar Cita
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Fecha seleccionada: {selectedDate?.toLocaleDateString('es-ES')}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    <span>Nombre completo</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} />
                    <span>Celular</span>
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu número de celular"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} />
                    <span>Correo electrónico</span>
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <X size={16} />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check size={16} />
                  <span>Aceptar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;