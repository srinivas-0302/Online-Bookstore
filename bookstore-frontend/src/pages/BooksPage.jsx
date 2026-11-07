import { getBooks } from "../api/bookApi";
import { getCategories } from "../api/categoryApi";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import SkeletonGrid from "../components/SkeletonGrid";
import useFetch from "../hooks/useFetch";
import useUrlParams from "../hooks/useUrlParams";
import { BOOK_SORT_OPTIONS, DEFAULT_BOOK_SORT } from "../utils/bookSort";
import { categoryHue } from "../utils/colors";

const PAGE_SIZE = 8;

export default function BooksPage() {
  const { searchParams, updateParams, clearParams } = useUrlParams();

  // ---------- Read everything from the URL ----------
  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const requestedSort = searchParams.get("sort");
  const sort = BOOK_SORT_OPTIONS.some((option) => option.value === requestedSort)
    ? requestedSort
    : DEFAULT_BOOK_SORT;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const [sortBy, direction] = sort.split(",");

  // ---------- Load data ----------
  const { data: categories } = useFetch(getCategories);

  const { data, loading, error } = useFetch(
    () =>
      getBooks({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        page: page - 1,
        size: PAGE_SIZE,
        sortBy,
        direction,
      }),
    [keyword, categoryId, sort, page]
  );

  // ---------- Change the URL ----------
  const handleSearch = (text) => updateParams({ keyword: text, page: "" });
  const handleCategorySelect = (id) => updateParams({ categoryId: id, page: "" });
  const handleSortChange = (event) =>
    updateParams({ sort: event.target.value === DEFAULT_BOOK_SORT ? "" : event.target.value, page: "" });
  const handlePageChange = (newPage) => {
    updateParams({ page: newPage === 1 ? "" : String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = keyword !== "" || categoryId !== "" || sort !== DEFAULT_BOOK_SORT;
  const showHero = !hasFilters && page === 1;

  // ---------- What to show below the filters ----------
  let content;
  if (error) {
    content = <p className="alert alert-error">{error}</p>;
  } else if (!data) {
    content = <SkeletonGrid count={PAGE_SIZE} />;
  } else if (data.content.length === 0) {
    content = (
      <div className="card empty-state">
        <p>
          {data.totalElements > 0
            ? "This page does not exist."
            : "No books found for your search."}
        </p>
        {data.totalElements > 0 ? (
          <button type="button" className="btn btn-outline" onClick={() => updateParams({ page: "" })}>
            Go to first page
          </button>
        ) : (
          hasFilters && (
            <button type="button" className="btn btn-outline" onClick={clearParams}>
              Clear filters
            </button>
          )
        )}
      </div>
    );
  } else {
    const from = data.page * data.size + 1;
    const to = from + data.content.length - 1;

    content = (
      <>
        <p className="muted">
          Showing {from} to {to} of {data.totalElements} books
        </p>

        <div className={loading ? "book-grid is-loading" : "book-grid"}>
          {data.content.map((book) => (
            <BookCard key={book.bookId} book={book} />
          ))}
        </div>

        <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <div>
      {showHero && (
        <section className="hero">
          <h1>Find your next favourite book</h1>
          <p>
            Browse {data ? data.totalElements : "our"} books
            {categories ? ` across ${categories.length} categories` : ""}. Search, filter and order in a
            few clicks.
          </p>
        </section>
      )}

      <div className="filters">
        {/* key={keyword} resets the typed text when the URL keyword changes (Back button, Clear) */}
        <SearchBar key={keyword} initialValue={keyword} onSearch={handleSearch} />

        <select value={sort} onChange={handleSortChange} aria-label="Sort books">
          {BOOK_SORT_OPTIONS.map((option) => (
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

      <div className="chip-row" role="group" aria-label="Categories">
        <button
          type="button"
          className={categoryId === "" ? "chip chip-all active" : "chip chip-all"}
          onClick={() => handleCategorySelect("")}
        >
          All
        </button>
        {(categories || []).map((category) => (
          <button
            key={category.categoryId}
            type="button"
            className={String(category.categoryId) === categoryId ? "chip active" : "chip"}
            style={{ "--cat-hue": categoryHue(category.name) }}
            onClick={() => handleCategorySelect(String(category.categoryId))}
          >
            {category.name}
          </button>
        ))}
      </div>

      {content}
    </div>
  );
}