import React, { useState, useEffect } from "react";
import { User, Mail, Phone, X, Check } from "lucide-react";
import "../styles/global.css";

export default function CalendarioCitas() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });
  const [bookedSlots, setBookedSlots] = useState({});
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const monthNames = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const dayNames = ["D", "L", "M", "M", "J", "V", "S"];

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            handleCloseForm();
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Función para obtener el último viernes del mes
  const getLastFridayOfMonth = (year, month) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const lastDate = new Date(year, month, lastDay);

    // Buscar el último viernes
    for (let day = lastDay; day >= 1; day--) {
      const date = new Date(year, month, day);
      if (date.getDay() === 5) {
        // 5 = viernes
        return day;
      }
    }
    return null;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 7.5;
    const endHour = 16.5;

    for (let hour = startHour; hour <= endHour; hour += 1) {
      const h = Math.floor(hour);
      const m = (hour % 1) * 60;
      const time = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      slots.push(time);
    }
    return slots;
  };

  const isDateDisabled = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Crear fecha máxima correctamente - último día del mes 11 meses adelante
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 11 + 1, 0);

    return date < today || date > maxDate || date.getDay() === 0;
  };

  const isWednesday = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.getDay() === 3;
  };

  // Nueva función para verificar si es el último viernes del mes
  const isLastFridayOfMonth = (day) => {
    const lastFriday = getLastFridayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    return day === lastFriday;
  };

  // Función combinada para verificar si es día de experiencia (miércoles o último viernes)
  const isExperienceDay = (day) => {
    return isWednesday(day) || isLastFridayOfMonth(day);
  };

  const handleDayClick = (day) => {
    if (isDateDisabled(day)) return;

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);

    if (isExperienceDay(day)) {
      setShowForm(true);
      setTimerActive(true);
    } else {
      setShowTimeSelection(true);
    }
  };

  const handleTimeSelect = (time) => {
    const dateKey = `${selectedDate.toISOString().split("T")[0]}_${time}`;
    if (bookedSlots[dateKey]) return;

    setSelectedTime(time);
    setShowTimeSelection(false);
    setShowForm(true);
    setTimerActive(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      errors.correo = "El correo es requerido";
    } else if (!emailRegex.test(formData.correo)) {
      errors.correo = "Correo inválido";
    }

    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es requerido";
    } else if (
      !phoneRegex.test(formData.telefono) ||
      formData.telefono.replace(/\D/g, "").length < 10
    ) {
      errors.telefono = "Teléfono inválido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (
      selectedDate &&
      !isExperienceDay(selectedDate.getDate()) &&
      selectedTime
    ) {
      const dateKey = `${
        selectedDate.toISOString().split("T")[0]
      }_${selectedTime}`;
      setBookedSlots((prev) => ({ ...prev, [dateKey]: true }));
    }

    setShowSuccess(true);
    setTimerActive(false);

    setTimeout(() => {
      handleCloseForm();
      setShowSuccess(false);
    }, 3000);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setShowTimeSelection(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ nombre: "", correo: "", telefono: "" });
    setFormErrors({});
    setTimeLeft(180);
    setTimerActive(false);
  };

  const changeMonth = (direction) => {
    const today = new Date();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);

    // Crear fechas límite correctamente
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 11, 1);
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);

    if (direction > 0 && newDate > maxDate) return;
    if (direction < 0 && newDate < minDate) return;

    setCurrentDate(newDate);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 md:h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const wednesday = isWednesday(day);
      const lastFriday = isLastFridayOfMonth(day);
      const experienceDay = isExperienceDay(day);
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth();

      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isPast = date < today;

      // Asesor académico: Lunes a sábado, NO experiencia, NO deshabilitado
      const isAcademicAdvisorDay =
        !experienceDay && !disabled && date.getDay() >= 1 && date.getDay() <= 6;

      // Día inhabilitado: domingo, pasado, O miércoles/último viernes pasado
      const isInhabilDay = disabled || (experienceDay && isPast);

      let backgroundColor = "";

      if (isAcademicAdvisorDay) {
        backgroundColor = "#8697bf"; // Asesor académico
      } else if (isInhabilDay) {
        backgroundColor = "#cbcacc"; // Inhabilitado
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={disabled}
          className={`
          h-10 md:h-12 rounded-lg font-medium transition-all duration-200 relative flex items-center justify-center
          ${
            disabled
              ? "cursor-not-allowed text-gray-400"
              : "hover:scale-105 cursor-pointer"
          }
          ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300"
              : ""
          }
        `}
        >
          {/* Fondo circular si aplica */}
          {(isAcademicAdvisorDay || isInhabilDay) && !experienceDay && (
            <span
              className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full"
              style={{
                backgroundColor: backgroundColor,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 0,
              }}
            />
          )}

          {/* Ícono de experiencia para días futuros, círculo gris para días pasados */}
          {experienceDay && (
            <>
              {!isPast ? (
                <img
                  src="/icon_exp.svg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <span
                  className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full"
                  style={{
                    backgroundColor: "#cbcacc",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                  }}
                />
              )}
            </>
          )}

          <span className="relative z-10">{day}</span>
        </button>
      );
    }

    return days;
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{
        backgroundImage: "url(/bg_calendar.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#2563eb",
      }}
    >
      <div className="max-w-7xl mx-auto relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3 sm:mb-5 md:mb-8 text-center">
  AGENDA TU VISITA
</h1>


        <div className="max-w-7xl mx-auto px-3">
          {/* Calendario alineado sobre el fondo de papel */}
          {/* Responsive: en móvil, las imágenes van arriba y en fila horizontal; en desktop, a la derecha y grandes */}
          {/* Calendario alineado sobre el fondo de papel */}
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-2 sm:gap-3 lg:gap-8">

            {/* Calendario con fondo más grande */}
            <div className="relative flex items-center justify-center min-h-[500px] w-full max-w-[560px] -translate-x-0 lg:-translate-x-2">
              <img
                src="/paper_calendar.svg"
                alt="Fondo calendario"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none scale-110 md:scale-125 pt-8"
                style={{ zIndex: 0 }}
              />
              <div
                className="relative flex flex-col items-center justify-start w-full h-full max-w-xs scale-90"
                style={{ zIndex: 1 }}
              >
                {/* Encabezado del mes + botones */}
                <div className="flex items-center justify-between mb-4 w-full max-w-md mx-auto min-h-[3.5rem]">
                  <div className="relative flex items-center justify-center gap-[2px] w-full">
                    {/* Flecha izquierda */}
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-0 flex items-center justify-center"
                      aria-label="Mes anterior"
                      style={{ marginRight: "5px" }}
                    >
                      <div className="w-0 h-0 border-t-[18px] border-t-transparent border-r-[28px] border-r-black-500 border-b-[18px] border-b-transparent"></div>
                    </button>

                    {/* Nombre del mes */}
                    <h2
  className="text-5xl md:text-5xl lg:text-5xl font-medium text-black-900 text-center px-0.5"
  style={{ fontFamily: "FuturaPT, Arial, sans-serif", minHeight: "3.5rem" }}
>
  {monthNames[currentDate.getMonth()]}
</h2>

                    {/* Flecha derecha */}
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-0 flex items-center justify-center"
                      aria-label="Mes siguiente"
                      style={{ marginLeft: "5px" }}
                    >
                      <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[28px] border-l-black-500 border-b-[18px] border-b-transparent"></div>
                    </button>

                    {/* Año debajo del mes (sin afectar la alineación de las flechas) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[-5px] font-bold text-black-500 leading-none">
                      {currentDate.getFullYear() !==
                        new Date().getFullYear() && (
                        <span>{currentDate.getFullYear()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 w-full max-w-md mx-auto">
                  {dayNames.map((day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="text-center text-xs md:text-sm text-black-700"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Celdas del calendario */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 w-full max-w-sm mx-auto min-h-[272px] md:min-h-[340px]">
                  {renderCalendar()}
                </div>

                {/* Simbología */}
                <div className="flex items-center justify-center gap-2 mt-4 w-full">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: "#cbcacc" }}
                  ></div>
                  <span className="text-xs md:text-sm text-black-700 font-medium">
                    No disponible
                  </span>
                </div>
              </div>
            </div>

            {/* Imágenes laterales */}
<div className="order-first lg:order-last flex flex-row lg:flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto mb-2 lg:mb-0">
  <img
    src="/simb_exp.svg"
    alt="Experiencia"
    className="
      w-[160px] h-[160px]   /* 📱 móvil base más grande */
      sm:w-[176px] sm:h-[176px]
      md:w-[200px] md:h-[200px]
      lg:w-[224px] lg:h-[224px]
      object-contain
      filter drop-shadow-[5px_5px_0px_rgba(255,255,255,0.4)]
    "
  />
  <img
    src="/simb_assist.svg"
    alt="Asesor"
    className="
      w-[160px] h-[160px]   /* 📱 móvil base más grande */
      sm:w-[176px] sm:h-[176px]
      md:w-[200px] md:h-[200px]
      lg:w-[224px] lg:h-[224px]
      object-contain scale-110 /* ⚖️ compensación para que luzca igual */
      filter drop-shadow-[5px_5px_0px_rgba(255,255,255,0.4)]
    "
  />
</div>




          </div>
        </div>
      </div>

      {/* Time Selection Modal */}
      {showTimeSelection && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 transform animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-900">
                Selecciona tu horario
              </h3>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {selectedDate?.toLocaleDateString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {generateTimeSlots().map((time) => {
                const dateKey = `${
                  selectedDate?.toISOString().split("T")[0]
                }_${time}`;
                const isBooked = bookedSlots[dateKey];

                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    disabled={isBooked}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-all
                      ${
                        isBooked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 hover:shadow-md"
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 transform animate-slide-up shadow-2xl">
            {!showSuccess ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-900">
                    {selectedDate && isExperienceDay(selectedDate.getDate())
                      ? "Vive la Experiencia Liceo"
                      : "Agenda tu cita"}
                  </h3>
                  <button
                    onClick={handleCloseForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {timerActive && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200 animate-pulse-subtle">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">
                        Tiempo restante:
                      </span>
                      <span className="font-mono font-bold text-amber-700">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">
                    {selectedDate?.toLocaleDateString("es-MX", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {selectedDate && isExperienceDay(selectedDate.getDate()) ? (
                    <p className="text-xs text-blue-600 mt-1">
                      Horario: 7:30 AM - 6:30 PM (Experiencia completa)
                    </p>
                  ) : (
                    <p className="text-xs text-blue-600 mt-1">
                      Hora de tu cita: {selectedTime}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre..."
                    />
                    {formErrors.nombre && (
                      <span className="text-xs text-red-500">
                        {formErrors.nombre}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={formData.correo}
                      onChange={(e) =>
                        setFormData({ ...formData, correo: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                    {formErrors.correo && (
                      <span className="text-xs text-red-500">
                        {formErrors.correo}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Tu número de celular..."
                    />
                    {formErrors.telefono && (
                      <span className="text-xs text-red-500">
                        {formErrors.telefono}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                  >
                    Confirmar cita
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  ¡Cita agendada!
                </h3>
                <p className="text-gray-600">
                  {selectedDate && isExperienceDay(selectedDate.getDate())
                    ? "Te esperamos para vivir la experiencia Liceo"
                    : "Tu cita ha sido confirmada exitosamente"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
