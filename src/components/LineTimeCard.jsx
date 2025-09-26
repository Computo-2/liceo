export default function TimelineCard({ src, alt, anio, children }) {
  return (
    <article
      className="
        rounded-3xl border border-gray-200 bg-white shadow-lg
        p-6 sm:p-7 transition hover:shadow-xl
      "
    >
      {/* Imagen */}
      <div className="mx-auto w-full max-w-[320px]">
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={src}
            alt={alt ?? ""}
            className="h-[190px] w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>

      {/* Línea punteada + círculo */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 border-t border-dotted border-gray-300" />
        <div className="grid place-items-center">
          <div className="h-8 w-8 rounded-full bg-white border-2 border-blue-600 grid place-items-center">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
          </div>
        </div>
        <div className="h-px flex-1 border-t border-dotted border-gray-300" />
      </div>

      {/* Año */}
      <p className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 text-center">
        {anio}
      </p>

      {/* Descripción (permite links) */}
      <div className="mt-2 text-center text-gray-700 text-[15px] leading-relaxed">
        {children}
      </div>
    </article>
  );
}

