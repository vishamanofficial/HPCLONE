import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import { blogsData } from '../data/blogsData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Calendar, Clock, ArrowLeft, Share2, Tag, BookOpen, ChevronRight } from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await api.getPublicBlogBySlug(slug);
        if (res.success && res.blog) {
          setBlog(res.blog);
          setRelated(res.related || []);
        } else {
          // Fallback to static seed
          const fallback = blogsData.find((b) => b.id === slug);
          if (fallback) {
            setBlog(fallback);
            setRelated(blogsData.filter((b) => b.id !== slug).slice(0, 3));
          }
        }
      } catch (err) {
        // Fallback to static seed
        const fallback = blogsData.find((b) => b.id === slug);
        if (fallback) {
          setBlog(fallback);
          setRelated(blogsData.filter((b) => b.id !== slug).slice(0, 3));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="text-sm font-semibold text-text-muted">Loading article...</span>
      </div>
    );
  }

  if (!blog) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{`${blog.title} | HangingPanda Tech Hub`}</title>
        <meta name="description" content={blog.excerpt} />
        <link rel="canonical" href={`https://hangingpanda.com/blog/${blog.slug || blog.id}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hangingpanda.com/blog/${blog.slug || blog.id}`} />
        <meta property="og:image" content={blog.featuredImage || 'https://hangingpanda.com/og-image.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Breadcrumb Bar */}
      <div className="bg-surface border-b border-border py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-primary font-bold truncate max-w-xs">{blog.title}</span>
        </div>
      </div>

      <article className="py-16 max-w-4xl mx-auto px-6 text-left">
        {/* Meta Header */}
        <div className="flex flex-col gap-4 pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
              {blog.category}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary" /> {blog.readTime || '6 min read'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-base text-text-secondary leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Author Card */}
          <div className="flex items-center justify-between pt-4 mt-2">
            <div className="flex items-center gap-3">
              <img
                src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={blog.author?.name}
                className="w-11 h-11 rounded-full object-cover border border-border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-primary">{blog.author?.name}</span>
                <span className="text-xs text-text-muted">{blog.author?.role}</span>
              </div>
            </div>

            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'June 15, 2026'}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-12 prose dark:prose-invert max-w-none text-base text-text-secondary leading-relaxed space-y-6">
          {blog.content ? (
            blog.content.split('\n\n').map((paragraph: string, idx: number) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-2xl font-black text-text-primary mt-8 mb-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2">
                    {paragraph.split('\n').map((line: string, i: number) => (
                      <li key={i}>{line.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })
          ) : (
            <p>{blog.excerpt}</p>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="py-6 border-t border-border flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">Tags:</span>
            {blog.tags.map((t: string) => (
              <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-surface border border-border text-text-secondary">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-16 mt-12 border-t border-border">
            <h3 className="text-xl font-black text-text-primary mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.slug || item.id} to={`/blog/${item.slug || item.id}`} className="group">
                  <Card hoverEffect="scale" className="p-5 flex flex-col justify-between h-full bg-card">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase">{item.category}</span>
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-2 mt-1">{item.excerpt}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary mt-4 flex items-center gap-1">
                      Read Article &rarr;
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
};
export default BlogDetail;
