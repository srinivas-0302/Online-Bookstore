export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="book-grid" aria-busy="true" aria-label="Loading books">
      {Array.from({ length: count }, (_, index) => (
        <div className="card skeleton-card" key={index}>
          <div className="skeleton skeleton-cover" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-button" />
        </div>
      ))}
    </div>
  );
}