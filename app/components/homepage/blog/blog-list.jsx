"use client";
import { useEffect, useState } from "react";
import BlogCard from "./blog-card";

export default function BlogList({ blogs }) {
  return (
    <>
      {blogs.map((blog, idx) => (
        blog?.cover_image && <BlogCard blog={blog} key={blog.id || idx} />
      ))}
    </>
  );
}
