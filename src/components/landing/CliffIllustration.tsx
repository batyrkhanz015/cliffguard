/**
 * A schematic of the 2026 cliff for the landing page. It shows the shape of the rule only:
 * no amounts, because every number in the product comes from the engine.
 */

const GIG_ARC = 'M200 168 Q240 -10 292 61';

export function CliffIllustration() {
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 360 214"
        role="img"
        aria-labelledby="cliff-title cliff-desc"
        className="h-auto w-full font-sans"
      >
        <title id="cliff-title">How the 2026 subsidy cliff works</title>
        <desc id="cliff-desc">
          Under 400% of the poverty line, the credit shrinks a little as income rises. A December gig that
          crosses the line means repaying the whole credit.
        </desc>
        <defs>
          <mask id="gig-arc-mask">
            <path className="gig-arc-reveal" d={GIG_ARC} pathLength={1} fill="none" stroke="#fff" strokeWidth={8} />
          </mask>
        </defs>

        <text x="8" y="16" className="fill-gray-400 font-pixel" fontSize="9">
          What you pay back in April
        </text>

        <polygon points="8,190 8,186 236,170 236,190" className="fill-violet/30" />
        <rect x="244" y="66" width="108" height="124" className="fill-cliff/15" />
        <line x1="8" y1="190" x2="352" y2="190" className="stroke-gray-600" strokeWidth={1} />
        <line x1="8" y1="186" x2="236" y2="170" className="stroke-white" strokeWidth={2.5} />
        <line x1="244" y1="66" x2="352" y2="66" className="stroke-cliff" strokeWidth={2.5} />
        <rect x="236" y="66" width="8" height="124" className="fill-cliff" />

        <text className="fill-gray-300" fontSize="11.5">
          <tspan x="8" y="118">Under the line, the credit</tspan>
          <tspan x="8" y="132">shrinks a little at a time.</tspan>
        </text>
        <text className="fill-gray-300" fontSize="11.5">
          <tspan x="252" y="90">Over the line,</tspan>
          <tspan x="252" y="104">repay all of it.</tspan>
        </text>

        <path
          d={GIG_ARC}
          mask="url(#gig-arc-mask)"
          fill="none"
          className="stroke-violet-link"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <text x="224" y="44" textAnchor="end" className="fill-white font-pixel" fontSize="9">
          A December gig
        </text>
        <circle cx="292" cy="66" r="6" className="gig-arc-landing fill-night stroke-cliff" strokeWidth={2.5} />

        <circle cx="200" cy="172.5" r="5.5" className="fill-violet-link stroke-night" strokeWidth={2} />
        <text x="190" y="158" textAnchor="end" className="fill-white font-pixel" fontSize="9">
          You, today
        </text>

        <text x="8" y="207" className="fill-gray-400 font-pixel" fontSize="9">
          Your 2026 income
        </text>
        <text x="240" y="207" textAnchor="middle" className="fill-cliff font-pixel" fontSize="9">
          400% of poverty line
        </text>
      </svg>
    </figure>
  );
}
