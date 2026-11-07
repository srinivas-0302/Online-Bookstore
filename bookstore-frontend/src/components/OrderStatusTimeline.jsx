const STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const LABELS = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default function OrderStatusTimeline({ status }) {
  if (status === "CANCELLED") {
    return <p className="alert alert-error">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <ol className="timeline">
      {STEPS.map((step, index) => {
        let stepClass = "";
        if (index < currentIndex) stepClass = "done";
        else if (index === currentIndex) stepClass = "current";

        return (
          <li key={step} className={stepClass}>
            <span className="timeline-dot">{index <= currentIndex ? "✓" : index + 1}</span>
            <span>{LABELS[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}