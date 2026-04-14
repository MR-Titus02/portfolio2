// @flow strict

import { personalData } from "@/utils/data/personal-data";
import BlogCard from "../components/homepage/blog/blog-card";

async function getBlogs() {
  const res = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@titusroxsan",
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error("Failed to fetch Medium blogs");

  const data = await res.json();

  const filtered = (data.items || [])
    .map((item, idx) => ({
      id: idx, // fallback ID
      title: item.title,
      cover_image: item.thumbnail || "/default-medium-image.jpg", // fallback image
      url: item.link,
      published_at: item.pubDate,
      description: item.description.replace(/<\/?[^>]+(>|$)/g, ""), // strip HTML
      reading_time_minutes: Math.max(Math.round(item.description.split(" ").length / 200), 1), // approx 200 wpm
      public_reactions_count: 0, // Medium RSS doesn't provide claps
      comments_count: 0           // Medium RSS doesn't provide comments
    }))
    .filter(item => item.cover_image); // only posts with images

  return filtered;
}


async function page() {
  const blogs = await getBlogs();

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
  {blogs.map((blog, i) => (
    blog?.thumbnail && (
      <BlogCard
        key={i}
        blog={{
          title: blog.title,
          cover_image: blog.thumbnail,
          url: blog.link,
          published_at: blog.pubDate,
          description: blog.description
        }}
      />
    )
  ))}
</div>
    </div>
  );
};

export default page;