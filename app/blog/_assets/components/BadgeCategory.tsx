import Link from "next/link";
import { categoryType } from "../content";
import clsx from "clsx";

// This is the category badge that appears in the article page and in <CardArticle /> component
const Category = ({
  category,
  className,
}: {
  category: categoryType;
  className?: string;
}) => {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className={clsx(
        "badge badge-sm md:badge-md hover:badge-primary",
        className,
      )}
      title={`Posts in ${category.title}`}
      rel="tag"
    >
      {category.titleShort}
    </Link>
  );
};

export default Category;
