import type { Dictionary } from "../content";

export function DecorativeNetwork({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="root-network" aria-hidden="true">
      <div className="visual-meta">
        <span>{dictionary.ui.publicView}</span>
        <span>{dictionary.ui.statusLabel}</span>
      </div>
      <svg viewBox="0 0 620 620" role="presentation">
        <defs>
          <linearGradient id="network-stroke" x1="80" y1="540" x2="520" y2="70">
            <stop stopColor="#B58A52" />
            <stop offset="1" stopColor="#69AAA4" />
          </linearGradient>
          <radialGradient id="network-glow">
            <stop stopColor="#69AAA4" stopOpacity=".2" />
            <stop offset="1" stopColor="#69AAA4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="310" cy="310" r="258" className="topo topo-outer" />
        <circle cx="310" cy="310" r="196" className="topo" />
        <circle cx="310" cy="310" r="133" className="topo" />
        <circle cx="310" cy="310" r="76" className="visual-glow" />
        <path className="axis" d="M310 74v472" />
        <path className="network-line" d="M310 520C300 458 235 447 214 395c-22-53 47-65 53-118 5-44-32-79-73-100" />
        <path className="network-line network-line-soft" d="M310 520c12-65 85-78 96-141 10-57-55-70-50-130 4-46 39-74 78-95" />
        <path className="network-line network-line-fine" d="M310 520c-50-43-112-37-153-82M310 520c49-48 111-45 157-91M268 277c-41-4-73-24-95-56M356 249c39-12 66-38 80-73M214 395c-39 5-70 25-94 54M406 379c42 7 72 31 92 63" />
        {[
          [310, 520, 6], [214, 395, 5], [268, 277, 5], [194, 177, 4],
          [406, 379, 5], [356, 249, 5], [434, 154, 4], [310, 310, 7],
        ].map(([cx, cy, radius]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={radius} className="network-node" />)}
      </svg>
      <div className="visual-caption">
        <i /><span>{dictionary.shared.approach.items[1].title}</span>
        <i /><span>{dictionary.shared.approach.items[2].title}</span>
        <i /><span>{dictionary.shared.approach.items[3].title}</span>
      </div>
    </div>
  );
}
