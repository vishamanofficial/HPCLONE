import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const PagesManager: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [pages, setPages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Create Page Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminPages();
      if (res.success) {
        setPages(res.pages);
      }
    } catch (err: any) {
      error(err.message || 'Failed to fetch pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);

    try {
      const res = await api.createAdminPage({
        title: newTitle,
        slug: newSlug || newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        status: 'draft',
        sections: [
          {
            id: `sec-${Date.now()}`,
            type: 'hero',
            name: 'Hero Section',
            order: 1,
            isEnabled: true,
            content: {
              headline: newTitle,
              description: 'Welcome to this custom page. Edit sections using the visual builder.',
              primaryBtnText: 'Get Started',
              primaryBtnUrl: '/contact'
            }
          }
        ]
      });

      if (res.success && res.page) {
        success(`Page "${res.page.title}" created successfully!`);
        setIsCreateOpen(false);
        setNewTitle('');
        setNewSlug('');
        fetchPages();
        navigate(`/admin/builder/${res.page._id}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to create page');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePublishToggle = async (page: any) => {
    try {
      if (page.status === 'published') {
        await api.unpublishAdminPage(page._id);
        success(`Page "${page.title}" moved to drafts.`);
      } else {
        await api.publishAdminPage(page._id);
        success(`Page "${page.title}" is now published live!`);
      }
      fetchPages();
    } catch (err: any) {
      error(err.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminPage(deleteTarget._id);
      success(`Page "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchPages();
    } catch (err: any) {
      error(err.message || 'Failed to delete page');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreview = async (page: any) => {
    try {
      const res = await api.generatePreviewToken('page', page._id);
      if (res.success && res.previewUrl) {
        window.open(res.previewUrl, '_blank');
      }
    } catch (err: any) {
      error(err.message || 'Failed to generate preview token');
    }
  };

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Pages & Section Builder
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Build, edit, reorder, preview, and publish website landing pages without coding.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Page
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search pages by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            <span className="text-xs text-text-muted font-semibold">Loading pages...</span>
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface/50 border-b border-border text-text-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Page Name & Slug</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Sections</th>
                  <th className="py-4 px-4">Revision</th>
                  <th className="py-4 px-4">SEO Health</th>
                  <th className="py-4 px-4">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPages.map((page) => (
                  <tr key={page._id} className="hover:bg-surface/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-text-primary">{page.title}</span>
                        <span className="font-mono text-[11px] text-primary">/{page.slug}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handlePublishToggle(page)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-colors ${
                          page.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {page.status === 'published' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-text-secondary">
                        {page.sections?.length || 0} sections
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border font-mono text-[10px]">
                        rev #{page.currentRevision || 1}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {page.seo?.metaTitle && page.seo?.metaDescription ? (
                        <span className="text-emerald-500 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold text-[11px] flex items-center gap-1">
                          Missing Meta
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-text-muted">
                      {new Date(page.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Visual Builder */}
                        <Link to={`/admin/builder/${page._id}`}>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                          >
                            Visual Builder
                          </Button>
                        </Link>

                        {/* Live Preview */}
                        <button
                          onClick={() => handlePreview(page)}
                          className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-surface transition-colors"
                          title="Preview draft layout"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete (if not home) */}
                        {page.slug !== 'home' && (
                          <button
                            onClick={() => setDeleteTarget(page)}
                            className="p-2 rounded-xl border border-border text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center gap-3">
            <Layers className="w-10 h-10 text-text-muted" />
            <h3 className="text-sm font-bold text-text-primary">No pages found</h3>
            <p className="text-xs text-text-secondary">Try adjusting your search terms or create a new page.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 text-left">
            <div>
              <h3 className="text-lg font-black text-text-primary tracking-tight">Create New Website Page</h3>
              <p className="text-xs text-text-secondary mt-1">
                Enter page title and custom URL slug. You can assemble sections in the builder next.
              </p>
            </div>

            <form onSubmit={handleCreatePage} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  Page Title
                </label>
                <Input
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Enterprise Cloud Solutions"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  URL Slug
                </label>
                <Input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. enterprise-cloud-solutions"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-text-secondary hover:bg-surface"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  isLoading={isCreating}
                >
                  Create & Launch Builder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete Page "${deleteTarget?.title}"?`}
        message="This action will delete this page and all its revisions from the database. This cannot be undone."
        confirmLabel="Yes, Delete Page"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default PagesManager;
