export function HoverGallery({
  items,
}: {
  items: Array<{ src: string; caption: string }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it, i) => (
        <figure
          key={i}
          className="group relative aspect-square overflow-hidden bg-line"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <figcaption className="absolute inset-0 grid place-items-center bg-paper/0 px-3 text-center font-mono text-xs uppercase tracking-label text-ink opacity-0 transition-all duration-300 group-hover:bg-paper/85 group-hover:opacity-100">
            {it.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
