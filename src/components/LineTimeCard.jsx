export default function TimelineCard({ src, alt, anio, children }) {
  return (
    <article
      className="
        rounded-3xl border border-gray-200 bg-white shadow-lg
        p-2 md:p-7 transition hover:shadow-xl -m-2 md:m-0
      "
    >
      <div className="mx-auto w-full max-w-[320px]">
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={src}
            alt={alt ?? ""}
            className="h-[100px] md:h-[130px] lg:h-[190px] w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 border-t border-dotted border-gray-300" />
        <div className="grid place-items-center">
          <div className="h-5 lg:h-8 w-5 lg:w-8 rounded-full bg-white border-2 border-blue-600 grid place-items-center">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
          </div>
        </div>
        <div className="h-px flex-1 border-t border-dotted border-gray-300" />
      </div>


      <p className="mt-4 text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-gray-900 text-center">
        {anio}
      </p>

    
      <div className="mt-2 text-center text-gray-700 text-[10px] md:text-[20px] lg:text-[30px] leading-relaxed">
        {children}
      </div>
    </article>
  );
}

