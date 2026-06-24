export function HowItWorksCurvedTitle() {
  return (
    <h2 className="how-it-works-curved-title">
      <span className="sr-only">In sync in three steps</span>
      <svg
        viewBox="0 0 900 140"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <path
            id="how-it-works-title-arc"
            d="M 70,108 A 380,88 0 0,1 830,108"
          />
        </defs>
        <text className="how-it-works-curved-title__text">
          <textPath
            href="#how-it-works-title-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            In sync in three steps
          </textPath>
        </text>
      </svg>
    </h2>
  );
}
