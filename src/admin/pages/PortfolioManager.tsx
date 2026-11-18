import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import {
  FolderGit2,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Save,
  X,
  TrendingUp,
  Tag
} from 'lucide-react';

export const PortfolioManager: React.FC = () => {
  const { success, error } = useToast();

  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Create state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminPortfolio();
      if (res.success) setPortfolio(res.portfolio);
    } catch (err: any) {
      error(err.message || 'Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      title: '',
      slug: '',
      clientName: '',
      category: 'Fintech',
      description: '',
      challenge: '',
      solution: '',
      results: '',
      metrics: [
        { label: 'Active Users', value: '100K+' },
        { label: 'SLA Uptime', value: '99.99%' }
      ],
      tags: ['Enterprise', 'Cloud'],
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      highlightColor: 'from-blue-600 to-cyan-500',
      status: 'published',
      displayOrder: portfolio.length + 1
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.title.trim()) return;
    setIsSaving(true);

    try {
      const cleanSlug = editingItem.slug
        ? editingItem.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-')
        : editingItem.title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');

      const payload = { ...editingItem, slug: cleanSlug };

      if (editingItem._id) {
        await api.updateAdminPortfolio(editingItem._id, payload);
        success(`Case study "${payload.title}" updated.`);
      } else {
        await api.createAdminPortfolio(payload);
        success(`Case study "${payload.title}" created.`);
      }

      setEditingItem(null);
      fetchPortfolio();
    } catch (err: any) {
      error(err.message || 'Failed to save portfolio item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminPortfolio(deleteTarget._id);
      success(`Case study "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchPortfolio();
    } catch (err: any) {
      error(err.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = portfolio.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Case Studies & Portfolio CMS
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage agency client success profiles, proven metrics, challenges, and architectural solutions.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Case Study
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
        <span className="text-xs font-bold text-text-muted">{portfolio.length} Projects in Catalog</span>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="p-6 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between gap-4 text-left group"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
                  {item.category}
                </span>
                <span className="text-xs text-text-muted font-medium">{item.clientName}</span>
              </div>

              <h3 className="text-base font-black text-text-primary tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {item.description}
              </p>

              {/* Metrics Pills */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {item.metrics?.slice(0, 2).map((m: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-xl bg-surface border border-border text-center">
                    <span className="text-sm font-black text-primary block leading-none">{m.value}</span>
                    <span className="text-[9px] text-text-muted uppercase font-bold mt-1 block">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <a
                href={`/case-studies#${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-bold text-primary hover:underline flex items-center gap-1"
              >
                #{item.slug} <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-surface"
                  title="Edit Case Study"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-2 rounded-xl border border-border text-text-secondary hover:text-rose-500 hover:bg-rose-500/10"
                  title="Delete Case Study"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  {editingItem._id ? 'Edit Case Study' : 'Add Case Study'}
                </h3>
                <span className="text-xs text-text-muted font-mono">
                  {editingItem.slug ? `#${editingItem.slug}` : 'New client showcase'}
                </span>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-2 text-text-muted hover:text-text-primary rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Project Title</label>
                  <Input
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: e.target.value,
                        slug: editingItem._id ? editingItem.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      })
                    }
                    placeholder="Marhba Islamic Banking"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">URL Hash / Slug</label>
                  <Input
                    value={editingItem.slug}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="marhba"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Client Name</label>
                  <Input
                    value={editingItem.clientName}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    placeholder="Marhba Financial Group"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-surface border border-border"
                  >
                    <option value="Fintech">Fintech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Project Description</label>
                <Textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Comprehensive description of the application built..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Technologies Used (comma separated)</label>
                <Input
                  value={editingItem.techStack?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      techStack: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })
                  }
                  placeholder="React Native, Node.js, PostgreSQL, AWS Shield"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-text-secondary hover:bg-surface"
                >
                  Cancel
                </button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Case Study
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete Case Study "${deleteTarget?.title}"?`}
        message="This will delete this project from the website portfolio. This cannot be undone."
        confirmLabel="Yes, Delete"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default PortfolioManager;
