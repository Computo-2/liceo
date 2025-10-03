import React, { useState, useEffect } from "react";
import { User, Mail, Phone, X, Check, Info } from "lucide-react";
import "../styles/global.css";

// Lee el endpoint público desde las envs de Astro
const SHEETS_ENDPOINT = import.meta.env.PUBLIC_SHEETS_ENDPOINT || "";

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

  const [bookedSlots, setBookedSlots] = useState({}); // reservado para posible no doble-booking futuro
  const [experienceCounts, setExperienceCounts] = useState({}); // { 'YYYY-MM-DD': number }

  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [infoMsg, setInfoMsg] = useState("");

  // NUEVO: estado de envío
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const getLastFridayOfMonth = (year, month) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let day = lastDay; day >= 1; day--) {
      const date = new Date(year, month, day);
      if (date.getDay() === 5) return day; // 5 = viernes
    }
    return null;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 7.5; // 7:30
    const endHour = 16.5; // 16:30
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

  const isWednesday = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.getDay() === 3;
  };

  const isLastFridayOfMonth = (day) => {
    const lastFriday = getLastFridayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    return day === lastFriday;
  };

  const isExperienceDay = (day) => {
    return isWednesday(day) || isLastFridayOfMonth(day);
  };

  const isDateDisabled = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Máximo 11 meses adelante (inclusive ese último mes)
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 0);

    // Domingos o fuera de rango
    if (date < today || date > maxDate || date.getDay() === 0) return true;

    // Si es Experiencia Liceo y ya hay 25 registros, deshabilitar
    const isExp = isExperienceDay(day);
    if (isExp) {
      const key = `${date.toISOString().split("T")[0]}`;
      if ((experienceCounts[key] || 0) >= 25) return true;
    }

    return false;
  };

  const handleDayClick = (day) => {
    if (isDateDisabled(day)) return;

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);

    const key = `${date.toISOString().split("T")[0]}`;
    if (isExperienceDay(day)) {
      const count = experienceCounts[key] || 0;
      if (count >= 25) {
        setInfoMsg(
          "El cupo para Experiencia Liceo en esta fecha está lleno (25)."
        );
        return;
      }
      setShowForm(true);
      setTimerActive(true);
      setInfoMsg("");
    } else {
      setShowTimeSelection(true);
      setInfoMsg("");
    }
  };

  // Solo bloqueamos horarios PASADOS si la cita es para HOY.
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimeSelection(false);
    setShowForm(true);
    setTimerActive(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) errors.correo = "El correo es requerido";
    else if (!emailRegex.test(formData.correo)) errors.correo = "Correo inválido";

    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es requerido";
    else if (
      !phoneRegex.test(formData.telefono) ||
      formData.telefono.replace(/\D/g, "").length < 10
    )
      errors.telefono = "Teléfono inválido";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isToday = (date) => {
    if (!date) return false;
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const isPastTimeToday = (time) => {
    if (!selectedDate) return false;
    if (!isToday(selectedDate)) return false;
    const now = new Date();
    const [h, m] = time.split(":").map((t) => parseInt(t, 10));
    const slotDate = new Date(selectedDate);
    slotDate.setHours(h, m, 0, 0);
    return slotDate <= now; // bloquea horas ya pasadas
  };

  const getExperienceRemaining = (date) => {
    const key = `${date.toISOString().split("T")[0]}`;
    return 25 - (experienceCounts[key] || 0);
  };

  // ===== Helpers NUEVOS para guardar en Sheets =====

  // Construye el payload con timestamps (UTC y local MX)
  const buildPayload = () => {
    const tz = "America/Mexico_City";
    const ahora = new Date();
    const created_at_utc = ahora.toISOString();
    const created_at_local = new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
      timeStyle: "medium",
      hour12: false,
      timeZone: tz,
    }).format(ahora);

    const fecha_cita = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : "";
    const esExperiencia = selectedDate
      ? isExperienceDay(selectedDate.getDate())
      : false;
    const tipo = esExperiencia ? "EXPERIENCIA" : "ASESOR";

    return {
      tipo,
      experiencia: esExperiencia,
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      telefono: formData.telefono.trim(),
      fecha_cita,
      hora_cita: esExperiencia ? "" : selectedTime || "",
      created_at_utc,
      created_at_local,
      timezone: tz,
      origen: "web",
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
  };

  
 // SIN headers para evitar preflight CORS
const sendToSheets = async (payload) => {
  if (!SHEETS_ENDPOINT) throw new Error("Falta PUBLIC_SHEETS_ENDPOINT");

  const fd = new FormData();
  fd.append("payload", JSON.stringify(payload)); // 👈 nombre del campo

  const res = await fetch(`${SHEETS_ENDPOINT}?t=${Date.now()}`, {
    method: "POST",
    body: fd,
  });

  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok || (data && data.ok === false)) {
    throw new Error((data && data.message) || `HTTP ${res.status}`);
  }
};


  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      if (selectedDate) {
        const dateISO = selectedDate.toISOString().split("T")[0];

        if (isExperienceDay(selectedDate.getDate())) {
          // Incrementa el contador (máx 25)
          setExperienceCounts((prev) => {
            const current = prev[dateISO] || 0;
            const next = Math.min(current + 1, 25);
            return { ...prev, [dateISO]: next };
          });
        } else {
          
        }
      }

      const payload = buildPayload();
      await sendToSheets(payload);

      setShowSuccess(true);
      setTimerActive(false);

      setTimeout(() => {
        handleCloseForm();
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "No se pudo guardar la cita.");
    } finally {
      setSubmitting(false);
    }
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
    setSubmitError("");
  };

  const changeMonth = (direction) => {
    const today = new Date();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);

    const maxDate = new Date(today.getFullYear(), today.getMonth() + 11, 1);
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);

    if (direction > 0 && newDate > maxDate) return;
    if (direction < 0 && newDate < minDate) return;

    setCurrentDate(newDate);
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

      const isAcademicAdvisorDay =
        !experienceDay && !disabled && date.getDay() >= 1 && date.getDay() <= 6;
      const isInhabilDay = disabled || (experienceDay && isPast);

      let backgroundColor = "";
      if (isAcademicAdvisorDay) backgroundColor = "#8697bf";
      else if (isInhabilDay && !experienceDay) backgroundColor = "#cbcacc";

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={disabled}
          className={`
          h-10 md:h-12 rounded-lg font-medium transition-all duration-200 relative flex items-center justify-center
          ${disabled ? "cursor-not-allowed text-gray-400" : "hover:scale-105 cursor-pointer"}
          ${isSelected ? "bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300" : ""}
        `}
        >
          {(isAcademicAdvisorDay || (isInhabilDay && !experienceDay)) && (
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
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-2 sm:gap-3 lg:gap-8">
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
                <div className="flex items-center justify-between mb-4 w-full max-w-md mx-auto min-h-[3.5rem]">
                  <div className="relative flex items-center justify-center gap-[2px] w-full">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-0 flex items-center justify-center"
                      aria-label="Mes anterior"
                      style={{ marginRight: "5px" }}
                    >
                      <div className="w-0 h-0 border-t-[18px] border-t-transparent border-r-[28px] border-r-black-500 border-b-[18px] border-b-transparent"></div>
                    </button>

                    <h2
                      className="text-5xl md:text-5xl lg:text-5xl font-medium text-black-900 text-center px-0.5"
                      style={{
                        fontFamily: "FuturaPT, Arial, sans-serif",
                        minHeight: "3.5rem",
                      }}
                    >
                      {monthNames[currentDate.getMonth()]}
                    </h2>

                    <button
                      onClick={() => changeMonth(1)}
                      className="p-0 flex items-center justify-center"
                      aria-label="Mes siguiente"
                      style={{ marginLeft: "5px" }}
                    >
                      <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[28px] border-l-black-500 border-b-[18px] border-b-transparent"></div>
                    </button>

                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[-5px] font-bold text-black-500 leading-none">
                      {currentDate.getFullYear() !== new Date().getFullYear() && (
                        <span>{currentDate.getFullYear()}</span>
                      )}
                    </div>
                  </div>
                </div>

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

                <div className="grid grid-cols-7 gap-1 md:gap-2 w-full max-w-sm mx-auto min-h-[272px] md:min-h-[340px]">
                  {renderCalendar()}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 w-full">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: "#cbcacc" }}
                  ></div>
                  <span className="text-xs md:text-sm text-black-700 font-medium">
                    No disponible
                  </span>
                </div>

                {infoMsg && (
                  <div className="mt-3 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">{infoMsg}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-first lg:order-last flex flex-row lg:flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-2 w-full lg:w-auto mb-2 lg:mb-0">
              <img
                src="/simb_exp.svg"
                alt="Experiencia"
                className="w-[180px] h-[180px] sm:w-[176px] sm:h-[176px] md:w-[200px] md:h-[200px] lg:w-[270px] lg:h-[270px] object-contain filter drop-shadow-[5px_5px_0px_rgba(255,255,255,0.4)]"
              />
              <img
                src="/simb_assist.svg"
                alt="Asesor"
                className="w-[185px] h-[185px] sm:w-[176px] sm:h-[176px] md:w-[200px] md:h-[200px] lg:w-[270px] lg:h-[270px] object-contain scale-110 filter drop-shadow-[5px_5px_0px_rgba(255,255,255,0.4)]"
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
                const disabled = isPastTimeToday(time);
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    disabled={disabled}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 hover:shadow-md"
                    }`}
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
                  {selectedDate &&
                  isExperienceDay(selectedDate.getDate()) ? (
                    <p className="text-xs text-blue-600 mt-1">
                      Horario: 7:30 AM - 6:30 PM (Experiencia completa) · Cupo
                      restante:{" "}
                      {selectedDate ? getExperienceRemaining(selectedDate) : 25}
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

                  {submitError && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                      {submitError}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`w-full py-3 text-white font-medium rounded-lg transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    }`}
                  >
                    {submitting ? "Guardando..." : "Confirmar cita"}
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
                  {selectedDate &&
                  isExperienceDay(selectedDate.getDate())
                    ? "Te esperamos para vivir la experiencia Liceo"
                    : "Tu cita ha sido confirmada exitosamente"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse-subtle { 0%,100% { opacity: 1; } 50% { opacity: 0.8; } }
        @keyframes bounce-subtle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
