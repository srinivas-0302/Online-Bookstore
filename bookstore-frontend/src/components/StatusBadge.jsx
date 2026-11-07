// Works for order status (PLACED, SHIPPED...) and payment status (PENDING, PAID...)
export default function StatusBadge({ status }) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`status-badge status-${status.toLowerCase()}`}>{label}</span>;
}