import { useState } from "react";

export default function SearchBar({ initialValue, onSearch }) {
  const [text, setText] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(text.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search by title, author or ISBN"
        aria-label="Search books"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}