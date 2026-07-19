// Full literal class strings on purpose (Tailwind can't see classes built with string concatenation).
const BANDS = [
  { min: 75, label: "Strong match", classes: "border-signal-strong text-signal-strong" },
  { min: 50, label: "Moderate match", classes: "border-signal-mid text-signal-mid" },
  { min: 0, label: "Needs work", classes: "border-signal-weak text-signal-weak" },
];

const getBand = (score) => BANDS.find((band) => score >= band.min) ?? BANDS[BANDS.length - 1];

const SIZES = {
  sm: "h-12 w-12 text-base border-2",
  lg: "h-28 w-28 text-4xl border-[3px]",
};

const ScoreBadge = ({ score, size = "lg" }) => {
  const band = getBand(score);
  const textClass = band.classes.split(" ")[1];

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`flex ${SIZES[size]} -rotate-3 items-center justify-center rounded-full border-dashed bg-white font-mono font-semibold ${band.classes}`}
      >
        {score}
      </div>
      {size === "lg" && (
        <span className={`font-mono text-[11px] uppercase tracking-wide ${textClass}`}>
          {band.label}
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
