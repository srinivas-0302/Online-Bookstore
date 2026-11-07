export const DEFAULT_BOOK_SORT = "createdAt,desc";

export const BOOK_SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Newest first" },
  { value: "title,asc", label: "Title: A to Z" },
  { value: "author,asc", label: "Author: A to Z" },
  { value: "price,asc", label: "Price: low to high" },
  { value: "price,desc", label: "Price: high to low" },
];
