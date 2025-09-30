export default function TimelineCard({ src, alt, anio, children }) {
  return (
    <article
      className="
        group rounded-[24px] border border-gray-200/70 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.06)]
        p-5 sm:p-6 transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]
      "
    >
      {/* Media */}
      <div className="rounded-[18px] overflow-hidden border border-gray-200/70">
        <img
          src={src}
          alt={alt ?? ""}
          className="w-full aspect-[16/9] object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Línea + punto */}
      <div className="mt-5 flex items-center gap-3 opacity-90">
        <div className="h-px flex-1 border-t border-dotted border-gray-300" />
        <div className="grid place-items-center">
          <div className="h-8 w-8 rounded-full bg-white border-2 border-blue-600 grid place-items-center">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
          </div>
        </div>
        <div className="h-px flex-1 border-t border-dotted border-gray-300" />
      </div>

      {/* Año */}
      <p className="mt-4 text-center text-2xl font-semibold tracking-tight text-gray-900">
        {anio}
      </p>

      {/* Descripción */}
      <div className="mt-2 text-center text-gray-700 text-[15px] leading-relaxed">
        {children}
      </div>
    </article>
  );
}
