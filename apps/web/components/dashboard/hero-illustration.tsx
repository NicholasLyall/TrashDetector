"use client";

export function HeroIllustration() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 240"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(190 70% 85%)" />
            <stop offset="50%" stopColor="hsl(195 60% 88%)" />
            <stop offset="100%" stopColor="hsl(170 40% 85%)" />
          </linearGradient>
          <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(155 50% 65%)" />
            <stop offset="100%" stopColor="hsl(150 45% 55%)" />
          </linearGradient>
          <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150 55% 50%)" />
            <stop offset="100%" stopColor="hsl(145 50% 40%)" />
          </linearGradient>
          <radialGradient id="globe" cx="0.35" cy="0.3" r="0.65">
            <stop offset="0%" stopColor="hsl(195 75% 72%)" />
            <stop offset="45%" stopColor="hsl(200 65% 55%)" />
            <stop offset="100%" stopColor="hsl(210 55% 40%)" />
          </radialGradient>
          <radialGradient id="globeLand" cx="0.4" cy="0.35" r="0.6">
            <stop offset="0%" stopColor="hsl(142 55% 55%)" />
            <stop offset="100%" stopColor="hsl(142 50% 42%)" />
          </radialGradient>
        </defs>

        {/* Sky fill */}
        <rect width="800" height="240" fill="url(#sky)" />

        {/* Cloud 1 — left */}
        <g className="animate-cloud-drift" opacity="0.9">
          <ellipse cx="100" cy="50" rx="55" ry="22" fill="white" />
          <ellipse cx="140" cy="42" rx="60" ry="28" fill="white" />
          <ellipse cx="185" cy="50" rx="48" ry="20" fill="white" />
        </g>

        {/* Cloud 2 — center */}
        <g className="animate-cloud-drift" style={{ animationDelay: "5s" }} opacity="0.7">
          <ellipse cx="380" cy="55" rx="40" ry="16" fill="white" />
          <ellipse cx="410" cy="48" rx="45" ry="20" fill="white" />
          <ellipse cx="440" cy="55" rx="35" ry="14" fill="white" />
        </g>

        {/* Cloud 3 — behind globe */}
        <g className="animate-cloud-drift" style={{ animationDelay: "3s" }} opacity="0.6">
          <ellipse cx="580" cy="70" rx="50" ry="18" fill="white" />
          <ellipse cx="620" cy="62" rx="55" ry="24" fill="white" />
          <ellipse cx="660" cy="70" rx="45" ry="17" fill="white" />
        </g>

        {/* Large Globe — right side */}
        <g className="animate-float" style={{ animationDuration: "6s" }}>
          <circle cx="620" cy="100" r="75" fill="url(#globe)" opacity="0.9" />
          {/* Continent shapes */}
          <ellipse cx="595" cy="75" rx="25" ry="20" fill="url(#globeLand)" opacity="0.75" />
          <ellipse cx="640" cy="105" rx="20" ry="15" fill="url(#globeLand)" opacity="0.65" />
          <ellipse cx="605" cy="120" rx="12" ry="10" fill="url(#globeLand)" opacity="0.55" />
          <ellipse cx="650" cy="78" rx="10" ry="8" fill="url(#globeLand)" opacity="0.5" />
          {/* Highlight */}
          <ellipse cx="590" cy="68" rx="18" ry="12" fill="white" opacity="0.15" />
          {/* Subtle grid lines */}
          <ellipse cx="620" cy="100" rx="75" ry="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15" />
          <ellipse cx="620" cy="100" rx="40" ry="75" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15" />
        </g>

        {/* Back hills */}
        <path
          d="M0 190 Q80 160 180 178 Q280 155 400 170 Q500 158 600 175 Q700 160 800 175 L800 240 L0 240Z"
          fill="url(#hillBack)"
          opacity="0.7"
        />

        {/* Small trees on back hills */}
        <g opacity="0.5">
          <polygon points="120,168 128,148 136,168" fill="hsl(150 45% 38%)" />
          <polygon points="720,162 728,142 736,162" fill="hsl(150 45% 38%)" />
          <circle cx="300" cy="160" r="10" fill="hsl(150 48% 40%)" />
        </g>

        {/* Front hills */}
        <path
          d="M0 210 Q100 195 200 205 Q320 190 440 200 Q550 192 650 206 Q740 196 800 204 L800 240 L0 240Z"
          fill="url(#hillFront)"
        />

        {/* Small grass/bushes on front hills */}
        <g opacity="0.6">
          <ellipse cx="50" cy="210" rx="12" ry="6" fill="hsl(142 55% 38%)" />
          <ellipse cx="180" cy="205" rx="10" ry="5" fill="hsl(142 50% 40%)" />
          <ellipse cx="760" cy="206" rx="14" ry="7" fill="hsl(142 52% 36%)" />
        </g>
      </svg>

      {/* Floating leaves */}
      <svg
        className="absolute top-[10%] right-[25%] opacity-50 animate-float"
        style={{ animationDuration: "4s" }}
        width="28" height="28" viewBox="0 0 32 32" fill="none"
      >
        <path d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z" fill="hsl(142 71% 45%)" transform="rotate(30 16 16)" />
      </svg>
      <svg
        className="absolute top-[60%] left-[3%] opacity-40 animate-float"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
        width="24" height="24" viewBox="0 0 32 32" fill="none"
      >
        <path d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z" fill="hsl(142 65% 50%)" transform="rotate(-20 16 16)" />
      </svg>
    </div>
  );
}
