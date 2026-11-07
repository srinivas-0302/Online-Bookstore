import { getDailySales, getTopBooks } from "../api/adminApi";
import BarChart from "../components/BarChart";
import DateRangeForm from "../components/DateRangeForm";
import useFetch from "../hooks/useFetch";
import useUrlParams from "../hooks/useUrlParams";
import { daysAgo, toIsoDate } from "../utils/dateUtils";
import { formatPrice, formatShortDate } from "../utils/format";

const LIMIT_OPTIONS = [5, 10, 20];

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <p className="muted">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

export default function AdminSalesPage() {
  const { searchParams, updateParams } = useUrlParams();

  // ---------- Read from the URL (default: the last 30 days) ----------
  const to = searchParams.get("to") || toIsoDate(new Date());
  const from = searchParams.get("from") || toIsoDate(daysAgo(29));
  const requestedLimit = parseInt(searchParams.get("limit"), 10);
  const limit = LIMIT_OPTIONS.includes(requestedLimit) ? requestedLimit : 5;

  // ---------- Load data ----------
  const sales = useFetch(() => getDailySales({ from, to }), [from, to]);
  const topBooks = useFetch(() => getTopBooks({ limit }), [limit]);

  const handleApply = (newFrom, newTo) => updateParams({ from: newFrom, to: newTo });
  const handleLimitChange = (event) =>
    updateParams({ limit: event.target.value === "5" ? "" : event.target.value });

  // ---------- Numbers for the summary cards (calculated from the daily list) ----------
  const days = sales.data || [];
  const totalSales = days.reduce((sum, day) => sum + day.totalAmount, 0);
  const totalOrders = days.reduce((sum, day) => sum + day.orderCount, 0);
  const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
  const bestDay = days.reduce(
    (best, day) => (day.totalAmount > 0 && (!best || day.totalAmount > best.totalAmount) ? day : best),
    null
  );

  const chartData = days.map((day) => ({
    value: day.totalAmount,
    tooltip: `${formatShortDate(day.date)}: ${formatPrice(day.totalAmount)} (${day.orderCount} ${
      day.orderCount === 1 ? "order" : "orders"
    })`,
  }));

  const daysWithSales = days.filter((day) => day.orderCount > 0).reverse();   // newest first

  // ---------- Daily sales section ----------
  let dailySection;
  if (sales.error) {
    dailySection = <p className="alert alert-error">{sales.error}</p>;
  } else if (!sales.data) {
    dailySection = <p>Loading sales...</p>;
  } else {
    dailySection = (
      <div className={sales.loading ? "is-loading" : ""}>
        <div className="stats-grid">
          <StatCard label="Total sales" value={formatPrice(totalSales)} />
          <StatCard label="Orders" value={totalOrders} />
          <StatCard label="Average order" value={formatPrice(averageOrder)} />
          <StatCard
            label="Best day"
            value={bestDay ? `${formatShortDate(bestDay.date)} • ${formatPrice(bestDay.totalAmount)}` : "-"}
          />
        </div>

        <div className="card chart-card">
          <h2>Daily sales</h2>
          <BarChart data={chartData} ariaLabel="Bar chart of daily sales" />
          <div className="chart-axis">
            <span>{formatShortDate(days[0]?.date)}</span>
            <span>{formatShortDate(days[days.length - 1]?.date)}</span>
          </div>
          <p className="muted small">Cancelled orders are not counted. Hover over a bar to see its day.</p>
        </div>

        <div className="card table-wrap">
          <h2>Days with sales</h2>
          {daysWithSales.length === 0 ? (
            <p className="muted">No sales in this period.</p>
          ) : (
            <table className="items-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {daysWithSales.map((day) => (
                  <tr key={day.date}>
                    <td>{formatShortDate(day.date)}</td>
                    <td>{day.orderCount}</td>
                    <td>{formatPrice(day.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ---------- Top books section ----------
  let topSection;
  if (topBooks.error) {
    topSection = <p className="alert alert-error">{topBooks.error}</p>;
  } else if (!topBooks.data) {
    topSection = <p>Loading top books...</p>;
  } else if (topBooks.data.length === 0) {
    topSection = <p className="muted">No sales yet.</p>;
  } else {
    topSection = (
      <table className="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Book</th>
            <th>Copies sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {topBooks.data.map((book, index) => (
            <tr key={book.bookId}>
              <td>{index + 1}</td>
              <td>
                <strong>{book.title}</strong>
                <p className="muted small">{book.author}</p>
              </td>
              <td>{book.quantitySold}</td>
              <td>{formatPrice(book.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <h1>Sales</h1>

      {/* key = the form starts again with new dates when the URL dates change */}
      <DateRangeForm key={`${from}_${to}`} from={from} to={to} onApply={handleApply} />

      {dailySection}

      <div className="page-header section-title">
        <h2>Top selling books</h2>
        <select value={limit} onChange={handleLimitChange} aria-label="Number of books">
          {LIMIT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              Top {option}
            </option>
          ))}
        </select>
      </div>
      <div className="card table-wrap">{topSection}</div>
      <p className="muted small">Top books count all sales so far (cancelled orders are not counted).</p>
    </div>
  );
}