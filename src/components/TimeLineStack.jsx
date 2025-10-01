import { useEffect, useRef, useState } from "react";
import TimelineCard from "../components/LineTimeCard.jsx";

export default function TimelineStack({
  items = [],
  top = 96,
  gap = 36,
  padBottom = 1000, 
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
        const z = items.length - i;
        const compact = i !== active;
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
