"use client";
import { useEffect, useState } from "react";

export default function BlogList({ blogs, BlogComponent }) {
  const [shuffledBlogs, setShuffledBlogs] = useState([]);

  useEffect(() => {
    const shuffled = [...blogs].sort(() => Math.random() - 0.5);
    setShuffledBlogs(shuffled);
  }, [blogs]);

  return (
    <>
      {shuffledBlogs.map((blog, idx) => (
        blog?.cover_image && <BlogCard blog={blog} key={blog.id || idx} />
      ))}
    </>
  );
}
