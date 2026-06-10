// @flow strict

import { personalData } from "@/utils/data/personal-data";
import BlogCard from "../components/homepage/blog/blog-card";

async function getBlogs() {
  const res = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@titusroxsan",
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const data = await res.json();

  const isValidImageUrl = (u) => {
    if (!u) return false;
    try { new URL(u); } catch { return false; }
    const path = u.split('?')[0].toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path)) return true;
    if (u.includes('miro.medium.com') || u.includes('res.cloudinary.com') || u.includes('media.dev.to') || u.includes('media2.dev.to')) return true;
    return false;
  };

  const extractImage = (item) => {
    const candidates = [];
    if (item.thumbnail) candidates.push(item.thumbnail);
    if (item.enclosure && item.enclosure.link) candidates.push(item.enclosure.link);
    const html = item.content || item.description || "";
    const m = html.match(/<img[^>]+src=["']?([^"'>\s]+)["']?/i);
    if (m) candidates.push(m[1]);
    for (const c of candidates) {
      if (isValidImageUrl(c)) return c;
    }
    return null;
  };

  const filtered = (data.items || [])
    .map((item, idx) => {
      const rawDescription = item.description || item.content || "";
      const cleanedDescription = rawDescription.replace(/<\/?[^>]+(>|$)/g, "");
      const img = extractImage(item) || "/image/blog_fallback.png";

      return {
        id: idx, // fallback ID
        title: item.title,
        cover_image: img,
        url: item.link,
        published_at: item.pubDate,
        description: cleanedDescription,
        reading_time_minutes: Math.max(Math.round(cleanedDescription.split(" ").length / 200), 1), // approx 200 wpm
        public_reactions_count: 0, // Medium RSS doesn't provide claps
        comments_count: 0,          // Medium RSS doesn't provide comments
      };
    })
    .filter(item => item.url) // only posts with URLs
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

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
          blog?.cover_image && (
            <BlogCard
              key={blog.id || i}
              blog={blog}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default page;