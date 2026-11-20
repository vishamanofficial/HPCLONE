'use client';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Calendar,
  Save,
  X,
  Eye,
  Tag
} from 'lucide-react';

export default function BlogsManagerPage() {
  const { success, error } = useToast();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Create Modal state
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminBlogs();
      if (res.success) setBlogs(res.blogs);
    } catch (err: any) {
      error(err.message || 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'AI & ML',
      tags: ['Artificial Intelligence', 'Software Architecture'],
      author: {
        name: 'Aarav Sharma',
        role: 'AI Solutions Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      readTime: '6 min read',
      status: 'published',
      featuredImage: '',
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: ''
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog.title.trim()) return;
    setIsSaving(true);

    try {
      const cleanSlug = editingBlog.slug
        ? editingBlog.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-')
        : editingBlog.title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');

      const payload = { ...editingBlog, slug: cleanSlug };

      if (editingBlog._id) {
        await api.updateAdminBlog(editingBlog._id, payload);
        success(`Article "${payload.title}" updated.`);
      } else {
        await api.createAdminBlog(payload);
        success(`Article "${payload.title}" published.`);
      }

      setEditingBlog(null);
      fetchBlogs();
    } catch (err: any) {
      error(err.message || 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminBlog(deleteTarget._id);
      success(`Article "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err: any) {
      error(err.message || 'Failed to delete blog');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Blog & Technical Knowledge CMS
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Publish technical deep dives, case audits, AI research posts, and target SEO articles.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Write New Article
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
        <span className="text-xs font-bold text-text-muted">{blogs.length} Articles in Database</span>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Blogs List Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface/50 border-b border-border text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Article Title & Category</th>
                <th className="py-4 px-4">Author</th>
                <th className="py-4 px-4">Read Time</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-text-primary">{blog.title}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {blog.category}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">/blog/{blog.slug}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={blog.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={blog.author?.name}
                        className="w-6 h-6 rounded-full object-cover border"
                      />
                      <span className="font-semibold text-text-primary">{blog.author?.name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-text-secondary font-medium">{blog.readTime || '5 min read'}</td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        blog.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-text-muted">
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-surface"
                        title="View Public Post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setEditingBlog(blog)}
                        className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-surface"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(blog)}
                        className="p-2 rounded-xl border border-border text-text-secondary hover:text-rose-500 hover:bg-rose-500/10"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  {editingBlog._id ? 'Edit Article' : 'Write New Article'}
                </h3>
                <span className="text-xs text-text-muted font-mono">
                  {editingBlog.slug ? `/blog/${editingBlog.slug}` : 'New SEO blog post'}
                </span>
              </div>
              <button onClick={() => setEditingBlog(null)} className="p-2 text-text-muted hover:text-text-primary rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Article Title</label>
                  <Input
                    value={editingBlog.title}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        title: e.target.value,
                        slug: editingBlog._id ? editingBlog.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      })
                    }
                    placeholder="How Autonomous AI Agents Transform Enterprise Workflows in 2026"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">URL Slug</label>
                  <Input
                    value={editingBlog.slug}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    placeholder="how-autonomous-ai-agents-transform-enterprise"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Category</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-surface border border-border"
                  >
                    <option value="AI & ML">AI & ML</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Tech Strategy">Tech Strategy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Estimated Read Time</label>
                  <Input
                    value={editingBlog.readTime}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    placeholder="6 min read"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Publish Status</label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-surface border border-border"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Article Excerpt (Summarizer)</label>
                <Textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  placeholder="Short summary displayed on cards and meta descriptions..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Full Article Body (Markdown / Rich Text)</label>
                <Textarea
                  rows={8}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  placeholder="Write the full post using paragraphs, headings (### Heading), bullet points..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Tags (comma separated)</label>
                <Input
                  value={editingBlog.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })
                  }
                  placeholder="AI, React, Architecture, Cloud"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-text-secondary hover:bg-surface"
                >
                  Cancel
                </button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Save & Publish Article
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete Article "${deleteTarget?.title}"?`}
        message="This will delete this blog post from the website and archives. This cannot be undone."
        confirmLabel="Yes, Delete Article"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

