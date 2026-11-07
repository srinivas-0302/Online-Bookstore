export default function QuantitySelector({ value, max, onChange, disabled = false }) {
  return (
    <div className="quantity-selector">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="quantity-value" aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}