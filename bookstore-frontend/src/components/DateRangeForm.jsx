import { useState } from "react";
import { daysAgo, toIsoDate } from "../utils/dateUtils";

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

export default function DateRangeForm({ from, to, onApply }) {
  const [fromValue, setFromValue] = useState(from);
  const [toValue, setToValue] = useState(to);
  const today = toIsoDate(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(fromValue, toValue);
  };

  const applyPreset = (days) => onApply(toIsoDate(daysAgo(days - 1)), today);

  return (
    <form className="date-range" onSubmit={handleSubmit}>
      <label>
        From
        <input type="date" value={fromValue} max={today} onChange={(e) => setFromValue(e.target.value)} />
      </label>
      <label>
        To
        <input type="date" value={toValue} max={today} onChange={(e) => setToValue(e.target.value)} />
      </label>
      <button type="submit" className="btn btn-primary">
        Apply
      </button>

      <div className="presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.days}
            type="button"
            className="btn btn-outline"
            onClick={() => applyPreset(preset.days)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </form>
  );
}