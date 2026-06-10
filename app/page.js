import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

async function getData() {
  const res = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@titusroxsan",
    { next: { revalidate: 3600 } } // ISR: 1 hour
  );

  if (!res.ok) {
    return [];
  }

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
      const cleanedDescription = rawDescription.replace(/<[^>]+>/g, "");
      const img = extractImage(item) || "/image/blog_fallback.png";

      return {
        id: item.guid || idx,
        title: item.title,
        cover_image: img,
        url: item.link,
        published_at: item.pubDate,
        description: cleanedDescription,
        reading_time_minutes: Math.max(Math.round(cleanedDescription.split(" ").length / 200), 1),
        public_reactions_count: 0,
        comments_count: 0,
      };
    })
    .filter((item) => item.url)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  return filtered;
}


export default async function Home() {
  const blogs = await getData();

  return (
    <div suppressHydrationWarning>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Blog blogs={blogs} />
      <ContactSection />
    </div>
  
  )
};