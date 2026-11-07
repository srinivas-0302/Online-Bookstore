// data = [{ value: 1250.5, tooltip: "12 Oct: ₹1,250.50 (2 orders)" }, ...]
export default function BarChart({ data, ariaLabel }) {
  const maxValue = Math.max(0, ...data.map((item) => item.value));

  return (
    <div className="bar-chart" role="img" aria-label={ariaLabel}>
      {data.map((item, index) => {
        let heightPercent = 0;
        if (maxValue > 0 && item.value > 0) {
          heightPercent = Math.max((item.value / maxValue) * 100, 2);   // at least a thin line
        }

        return (
          <div className="bar-slot" key={index} title={item.tooltip}>
            <div className="bar" style={{ height: `${heightPercent}%` }} />
          </div>
        );
      })}
    </div>
  );
}