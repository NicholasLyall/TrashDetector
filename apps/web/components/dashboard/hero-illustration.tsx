"use client";

export function HeroIllustration() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      {/* Cloud 1 */}
      <svg
        className="absolute top-[15%] left-[10%] opacity-70 dark:opacity-15 animate-cloud-drift"
        width="120"
        height="50"
        viewBox="0 0 120 50"
        fill="none"
      >
        <ellipse cx="35" cy="30" rx="30" ry="18" fill="white" />
        <ellipse cx="60" cy="22" rx="35" ry="22" fill="white" />
        <ellipse cx="90" cy="30" rx="25" ry="16" fill="white" />
      </svg>

      {/* Cloud 2 */}
      <svg
        className="absolute top-[25%] right-[15%] opacity-60 dark:opacity-10 animate-cloud-drift"
        style={{ animationDelay: "3s" }}
        width="90"
        height="40"
        viewBox="0 0 90 40"
        fill="none"
      >
        <ellipse cx="25" cy="24" rx="22" ry="14" fill="white" />
        <ellipse cx="45" cy="18" rx="28" ry="18" fill="white" />
        <ellipse cx="68" cy="24" rx="20" ry="13" fill="white" />
      </svg>

      {/* Cloud 3 */}
      <svg
        className="absolute bottom-[35%] left-[55%] opacity-50 dark:opacity-10 animate-cloud-drift"
        style={{ animationDelay: "6s" }}
        width="100"
        height="44"
        viewBox="0 0 100 44"
        fill="none"
      >
        <ellipse cx="28" cy="26" rx="24" ry="15" fill="white" />
        <ellipse cx="50" cy="20" rx="30" ry="20" fill="white" />
        <ellipse cx="76" cy="26" rx="22" ry="14" fill="white" />
      </svg>

      {/* Leaf 1 */}
      <svg
        className="absolute top-[10%] right-[8%] opacity-50 dark:opacity-40 animate-float"
        style={{
          animationDuration: "3s",
          animationDelay: "0s",
          transform: "rotate(25deg)",
        }}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
        />
        <line
          x1="16"
          y1="8"
          x2="16"
          y2="28"
          stroke="hsl(142 71% 35%)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Leaf 2 */}
      <svg
        className="absolute top-[60%] left-[5%] opacity-40 dark:opacity-35 animate-float"
        style={{
          animationDuration: "4s",
          animationDelay: "0.7s",
          transform: "rotate(-15deg)",
        }}
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
        />
        <line
          x1="16"
          y1="8"
          x2="16"
          y2="28"
          stroke="hsl(142 71% 35%)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Leaf 3 */}
      <svg
        className="absolute bottom-[15%] right-[20%] opacity-60 dark:opacity-45 animate-float"
        style={{
          animationDuration: "3.5s",
          animationDelay: "1.2s",
          transform: "rotate(40deg)",
        }}
        width="36"
        height="36"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
        />
        <line
          x1="16"
          y1="8"
          x2="16"
          y2="28"
          stroke="hsl(142 71% 35%)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Leaf 4 */}
      <svg
        className="absolute top-[35%] left-[85%] opacity-30 dark:opacity-25 animate-float"
        style={{
          animationDuration: "5s",
          animationDelay: "0.3s",
          transform: "rotate(-30deg)",
        }}
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
        />
        <line
          x1="16"
          y1="8"
          x2="16"
          y2="28"
          stroke="hsl(142 71% 35%)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Leaf 5 - hidden on very small screens */}
      <svg
        className="absolute bottom-[25%] left-[15%] opacity-70 dark:opacity-50 animate-float hidden sm:block"
        style={{
          animationDuration: "4.2s",
          animationDelay: "1.8s",
          transform: "rotate(60deg)",
        }}
        width="40"
        height="40"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z"
          fill="hsl(142 71% 45%)"
        />
        <line
          x1="16"
          y1="8"
          x2="16"
          y2="28"
          stroke="hsl(142 71% 35%)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
