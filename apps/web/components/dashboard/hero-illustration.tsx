"use client";

export function HeroIllustration() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      {/* Full-scene SVG background with hills, trees, and clouds */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(199 89% 88%)" />
            <stop offset="60%" stopColor="hsl(199 60% 92%)" />
            <stop offset="100%" stopColor="hsl(174 40% 90%)" />
          </linearGradient>
          <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(142 45% 65%)" />
            <stop offset="100%" stopColor="hsl(142 40% 55%)" />
          </linearGradient>
          <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(142 50% 58%)" />
            <stop offset="100%" stopColor="hsl(142 45% 48%)" />
          </linearGradient>
          <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(142 55% 52%)" />
            <stop offset="100%" stopColor="hsl(142 50% 42%)" />
          </linearGradient>
        </defs>

        {/* Sky fill */}
        <rect width="800" height="320" fill="url(#sky)" />

        {/* Cloud 1 — large left */}
        <g className="animate-cloud-drift" opacity="0.85">
          <ellipse cx="140" cy="60" rx="50" ry="22" fill="white" />
          <ellipse cx="180" cy="50" rx="60" ry="28" fill="white" />
          <ellipse cx="225" cy="58" rx="45" ry="20" fill="white" />
          <ellipse cx="190" cy="62" rx="55" ry="18" fill="white" />
        </g>

        {/* Cloud 2 — right */}
        <g className="animate-cloud-drift" style={{ animationDelay: "4s" }} opacity="0.75">
          <ellipse cx="580" cy="45" rx="40" ry="18" fill="white" />
          <ellipse cx="615" cy="38" rx="50" ry="24" fill="white" />
          <ellipse cx="650" cy="45" rx="35" ry="16" fill="white" />
          <ellipse cx="620" cy="48" rx="45" ry="15" fill="white" />
        </g>

        {/* Cloud 3 — small center */}
        <g className="animate-cloud-drift" style={{ animationDelay: "7s" }} opacity="0.6">
          <ellipse cx="420" cy="72" rx="30" ry="14" fill="white" />
          <ellipse cx="445" cy="65" rx="38" ry="18" fill="white" />
          <ellipse cx="468" cy="72" rx="28" ry="12" fill="white" />
        </g>

        {/* Back hills — light green, gentle rolling */}
        <path
          d="M0 220 Q100 170 200 200 Q300 160 400 190 Q500 165 600 195 Q700 170 800 200 L800 320 L0 320Z"
          fill="url(#hillBack)"
          opacity="0.7"
        />

        {/* Back trees — on back hills */}
        {/* Conifer left */}
        <g opacity="0.5">
          <polygon points="120,185 130,155 140,185" fill="hsl(142 40% 40%)" />
          <polygon points="122,195 130,165 138,195" fill="hsl(142 40% 38%)" />
        </g>
        {/* Round tree right-back */}
        <g opacity="0.5">
          <circle cx="620" cy="170" r="16" fill="hsl(142 40% 42%)" />
          <rect x="617" y="180" width="6" height="12" fill="hsl(30 30% 35%)" rx="1" />
        </g>
        {/* Small conifer back-center */}
        <g opacity="0.45">
          <polygon points="380,175 388,148 396,175" fill="hsl(142 40% 40%)" />
        </g>

        {/* Mid hills — medium green */}
        <path
          d="M0 250 Q80 215 180 240 Q260 205 370 230 Q470 210 560 240 Q660 215 750 235 Q800 225 800 250 L800 320 L0 320Z"
          fill="url(#hillMid)"
          opacity="0.85"
        />

        {/* Mid-layer trees */}
        {/* Round tree left */}
        <g opacity="0.7">
          <circle cx="85" cy="218" r="18" fill="hsl(142 45% 38%)" />
          <circle cx="100" cy="215" r="14" fill="hsl(142 48% 42%)" />
          <rect x="88" y="230" width="7" height="14" fill="hsl(30 25% 32%)" rx="1" />
        </g>
        {/* Conifer mid */}
        <g opacity="0.65">
          <polygon points="300,225 312,188 324,225" fill="hsl(142 45% 35%)" />
          <polygon points="303,235 312,200 321,235" fill="hsl(142 42% 32%)" />
          <rect x="309" y="232" width="6" height="10" fill="hsl(30 25% 30%)" rx="1" />
        </g>
        {/* Round tree mid-right */}
        <g opacity="0.65">
          <circle cx="520" cy="220" r="15" fill="hsl(142 48% 40%)" />
          <circle cx="535" cy="218" r="12" fill="hsl(142 50% 44%)" />
          <rect x="524" y="230" width="6" height="12" fill="hsl(30 25% 32%)" rx="1" />
        </g>
        {/* Small conifer far right */}
        <g opacity="0.6">
          <polygon points="710,222 720,195 730,222" fill="hsl(142 42% 36%)" />
          <rect x="717" y="220" width="5" height="8" fill="hsl(30 25% 30%)" rx="1" />
        </g>

        {/* Front hills — darkest green, closest */}
        <path
          d="M0 275 Q100 255 200 268 Q320 250 440 265 Q550 252 650 270 Q740 258 800 265 L800 320 L0 320Z"
          fill="url(#hillFront)"
        />

        {/* Front trees — on front hills */}
        {/* Large round tree front-left */}
        <g opacity="0.85">
          <circle cx="50" cy="248" r="22" fill="hsl(142 50% 34%)" />
          <circle cx="68" cy="245" r="18" fill="hsl(142 52% 38%)" />
          <circle cx="36" cy="252" r="14" fill="hsl(142 48% 32%)" />
          <rect x="46" y="264" width="8" height="16" fill="hsl(30 25% 28%)" rx="2" />
        </g>
        {/* Conifer front-center-left */}
        <g opacity="0.75">
          <polygon points="220,260 234,222 248,260" fill="hsl(142 48% 30%)" />
          <polygon points="224,270 234,238 244,270" fill="hsl(142 45% 28%)" />
          <rect x="231" y="268" width="6" height="10" fill="hsl(30 25% 26%)" rx="1" />
        </g>
        {/* Round bush front-right */}
        <g opacity="0.8">
          <circle cx="680" cy="258" r="16" fill="hsl(142 50% 36%)" />
          <circle cx="695" cy="255" r="13" fill="hsl(142 52% 40%)" />
        </g>
        {/* Small bush front-far-right */}
        <g opacity="0.7">
          <ellipse cx="770" cy="262" rx="20" ry="12" fill="hsl(142 48% 34%)" />
        </g>
      </svg>

      {/* Floating leaves — positioned absolutely, animated */}
      {/* Leaf 1 — top right */}
      <svg
        className="absolute top-[8%] right-[10%] opacity-55 dark:opacity-40 animate-float"
        style={{ animationDuration: "3s", animationDelay: "0s" }}
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
          transform="rotate(25 16 16)"
        />
        <line x1="16" y1="8" x2="16" y2="28" stroke="hsl(142 71% 35%)" strokeWidth="1" opacity="0.5" transform="rotate(25 16 16)" />
      </svg>

      {/* Leaf 2 — left side */}
      <svg
        className="absolute top-[55%] left-[4%] opacity-45 dark:opacity-35 animate-float"
        style={{ animationDuration: "4s", animationDelay: "0.7s" }}
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 65% 50%)"
          transform="rotate(-20 16 16)"
        />
        <line x1="16" y1="8" x2="16" y2="28" stroke="hsl(142 60% 38%)" strokeWidth="1" opacity="0.5" transform="rotate(-20 16 16)" />
      </svg>

      {/* Leaf 3 — center-right */}
      <svg
        className="absolute top-[18%] right-[30%] opacity-40 dark:opacity-30 animate-float"
        style={{ animationDuration: "3.5s", animationDelay: "1.2s" }}
        width="22"
        height="22"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
          transform="rotate(45 16 16)"
        />
      </svg>

      {/* Leaf 4 — right edge */}
      <svg
        className="absolute top-[35%] left-[88%] opacity-35 dark:opacity-25 animate-float"
        style={{ animationDuration: "5s", animationDelay: "0.3s" }}
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
          transform="rotate(-35 16 16)"
        />
        <line x1="16" y1="8" x2="16" y2="28" stroke="hsl(142 71% 35%)" strokeWidth="1" opacity="0.4" transform="rotate(-35 16 16)" />
      </svg>

      {/* Leaf 5 — left center, hidden on small screens */}
      <svg
        className="absolute top-[12%] left-[18%] opacity-50 dark:opacity-40 animate-float hidden sm:block"
        style={{ animationDuration: "4.2s", animationDelay: "1.8s" }}
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 68% 48%)"
          transform="rotate(60 16 16)"
        />
      </svg>
    </div>
  );
}
