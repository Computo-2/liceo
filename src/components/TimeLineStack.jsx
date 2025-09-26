import { useEffect, useRef, useState } from "react";
import TimelineCard from "../components/LineTimeCard.jsx";

/** items: [{ anio, src, alt, html?: string, desc?: ReactNode }] */
export default function TimelineStack({
  items = [],
  top = 96,        // altura donde “pega” cada tarjeta (ajusta si tienes navbar fija)
  gap = 36,        // separación inicial entre tarjetas
  padBottom = 1000, // espacio al final para soltar el stack y seguir la página
}) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(Number(visible[0].target.dataset.idx));
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: `-${top}px 0px -40% 0px` }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [top, items.length]);

  return (
    <div className="relative" style={{ paddingBottom: padBottom }}>
      {items.map((it, i) => {
        const z = items.length - i;      // la de abajo (más nueva) sobre la de arriba
        const compact = i !== active;    // solo la activa muestra imagen/descr.
        return (
          <div
            key={i}
            data-idx={i}
            ref={(el) => (refs.current[i] = el)}
            className="sticky"
            style={{ top, zIndex: z, marginTop: i === 0 ? 0 : gap }}
          >
            <TimelineCard src={it.src} alt={it.alt} anio={it.anio} compact={compact}>
              {it.html
                ? <span dangerouslySetInnerHTML={{ __html: it.html }} />
                : it.desc ?? null}
            </TimelineCard>
          </div>
        );
      })}
    </div>
  );
}
