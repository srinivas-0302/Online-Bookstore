import { useState } from "react";
import { categoryHue } from "../utils/colors";

// Shows the book image. If there is no image, or the link is broken,
// it shows a coloured "cover" made from the book's title.
export default function BookCover({ imageUrl, title, large = false }) {
  const [failed, setFailed] = useState(false);
  const className = large ? "book-cover book-cover-large" : "book-cover";

  if (!imageUrl || failed) {
    return (
      <div
        className={`${className} book-cover-placeholder`}
        style={{ "--cover-hue": categoryHue(title) }}
        role="img"
        aria-label={title}
      >
        <span className="cover-emoji">📖</span>
        <span className="cover-title">{title}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={imageUrl}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}