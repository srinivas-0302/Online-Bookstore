import { Link } from "react-router-dom";
import { getCustomers } from "../api/adminApi";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import useFetch from "../hooks/useFetch";
import useUrlParams from "../hooks/useUrlParams";
import { formatDateTime } from "../utils/format";

const PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt,desc";

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Newest first" },
  { value: "createdAt,asc", label: "Oldest first" },
  { value: "name,asc", label: "Name: A to Z" },
  { value: "email,asc", label: "Email: A to Z" },
];

export default function AdminCustomersPage() {
  const { searchParams, updateParams, clearParams } = useUrlParams();

  const keyword = searchParams.get("keyword") || "";
  const requestedSort = searchParams.get("sort");
  const sort = SORT_OPTIONS.some((option) => option.value === requestedSort)
    ? requestedSort
    : DEFAULT_SORT;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const [sortBy, direction] = sort.split(",");

  const { data, loading, error } = useFetch(
    () =>
      getCustomers({
        keyword: keyword || undefined,
        page: page - 1,
        size: PAGE_SIZE,
        sortBy,
        direction,
      }),
    [keyword, sort, page]
  );

  const hasFilters = keyword !== "" || sort !== DEFAULT_SORT;

  const handleSearch = (text) => updateParams({ keyword: text, page: "" });
  const handleSortChange = (event) =>
    updateParams({ sort: event.target.value === DEFAULT_SORT ? "" : event.target.value, page: "" });
  const handlePageChange = (newPage) => updateParams({ page: newPage === 1 ? "" : String(newPage) });

  let content;
  if (error) {
    content = <p className="alert alert-error">{error}</p>;
  } else if (!data) {
    content = <p>Loading customers...</p>;
  } else if (data.content.length === 0) {
    content = (
      <div className="card empty-state">
        <p>{data.totalElements > 0 ? "This page does not exist." : "No customers found."}</p>
        {hasFilters && (
          <button type="button" className="btn btn-outline" onClick={clearParams}>
            Clear filters
          </button>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <p className="muted">
          {data.totalElements} {data.totalElements === 1 ? "customer" : "customers"} found
        </p>

        <div className={loading ? "card table-wrap is-loading" : "card table-wrap"}>
          <table className="items-table admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((customer) => (
                <tr key={customer.userId}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || "-"}</td>
                  <td>{formatDateTime(customer.createdAt)}</td>
                  <td>
                    <Link to={`/admin/orders?customerId=${customer.userId}`} className="btn btn-outline">
                      View orders
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <div>
      <h1>Customers</h1>

      <div className="filters">
        <SearchBar key={keyword} initialValue={keyword} onSearch={handleSearch} />

        <select value={sort} onChange={handleSortChange} aria-label="Sort customers">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" className="btn btn-outline" onClick={clearParams}>
            Clear
          </button>
        )}
      </div>

      {content}
    </div>
  );
}