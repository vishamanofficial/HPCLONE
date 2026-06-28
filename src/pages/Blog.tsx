import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Calendar, Clock } from "lucide-react";
import { blogsData } from "../data/blogsData";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

type CategoryFilter = "All" | "AI & ML" | "Web Development" | "Mobile Apps" | "Tech Strategy";

export const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");

  const categories: CategoryFilter[] = ["All", "AI & ML", "Web Development", "Mobile Apps", "Tech Strategy"];

  const filteredArticles = blogsData.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>HangingPanda Technical Blog | Custom Software Insights</title>
        <meta
          name="description"
          content="Audit the latest tech guides. HangingPanda writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies."
        />
        <link rel="canonical" href="https://hangingpanda.com/blog" />
        <meta property="og:title" content="HangingPanda Technical Blog | Custom Software Insights" />
        <meta property="og:description" content="Audit the latest tech guides. HangingPanda writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/blog" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HangingPanda Technical Blog | Custom Software Insights" />
        <meta name="twitter:description" content="Audit the latest tech guides. HangingPanda writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="bg-gradient-to-b from-surface to-bg py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Developer Knowledge Hub
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            Our Latest Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Insights & Analyses</span>.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-6 leading-relaxed max-w-2xl mx-auto">
            Deep dives into artificial intelligence, cross-platform mobile apps, cloud scalability guides, and software project management.
          </p>
        </div>
      </section>

      {/* Spotlight Featured Article */}
      <section className="pt-8 pb-16 max-w-7xl mx-auto px-6">
        <span className="block text-xs font-black text-primary uppercase tracking-widest mb-6 text-center lg:text-left">
          Featured Article
        </span>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-border bg-card p-6 sm:p-10 rounded-3xl shadow-xl items-center text-left"
        >
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
              {blogsData[0].category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight hover:text-primary transition-colors cursor-pointer">
              {blogsData[0].title}
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mt-2">
              {blogsData[0].excerpt}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {blogsData[0].tags.map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-text-secondary bg-surface px-2.5 py-1 rounded-md border border-border/40">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3 mt-6 border-t border-border/40 pt-4 w-full">
              <img
                src={blogsData[0].author.avatarUrl}
                alt={blogsData[0].author.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-primary leading-tight">
                  {blogsData[0].author.name}
                </span>
                <span className="text-[10px] text-text-muted">
                  {blogsData[0].author.role}
                </span>
              </div>
              <span className="text-[10px] font-bold text-text-muted ml-auto flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {blogsData[0].publishedAt}
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 w-full">
            <div className="aspect-video w-full rounded-2xl bg-gradient-to-tr from-primary/20 to-accent-orange/20 border border-white/10 p-8 flex flex-col justify-between shadow-lg">
              <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                HP
              </span>
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Estimated Read Time</span>
                <div className="flex items-center gap-1.5 text-text-primary font-black mt-1">
                  <Clock className="w-4 h-4 text-primary" />
                  {blogsData[0].readTime}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 border rounded-full text-xs font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                  : "bg-card text-text-secondary border-border hover:bg-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <Input
            placeholder="Search articles & tags..."
            aria-label="Search articles and tags"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4.5 h-4.5 text-text-muted" />}
          />
        </div>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-6">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                hoverEffect="scale"
                className="flex flex-col justify-between h-full p-6 sm:p-8 bg-card"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-2 hover:text-primary transition-colors cursor-pointer">
                    {article.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {article.tags.map((t) => (
                      <span key={t} className="text-[10px] font-bold text-text-secondary bg-surface px-2 py-0.5 rounded-md border border-border/40">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 mt-8 pt-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={article.author.avatarUrl}
                      alt={article.author.name}
                      width={36}
                      height={36}
                      loading="lazy"
                      decoding="async"
                      className="w-9 h-9 rounded-full object-cover border border-border"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-text-primary leading-tight">
                        {article.author.name}
                      </span>
                      <span className="text-[9px] text-text-muted">
                        {article.author.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.publishedAt}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl p-8">
            <span className="text-3xl">🔍</span>
            <h2 className="font-bold text-lg text-text-primary mt-4">No articles found</h2>
            <p className="text-xs text-text-secondary mt-2">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        )}
      </section>
    </>
  );
};
export default Blog;
