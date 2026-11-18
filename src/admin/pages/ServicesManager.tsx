import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import {
  Briefcase,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Code,
  Layers,
  ChevronDown,
  X,
  Save,
  HelpCircle
} from 'lucide-react';

export const ServicesManager: React.FC = () => {
  const { success, error } = useToast();

  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Create Modal state
  const [editingService, setEditingService] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminServices();
      if (res.success) setServices(res.services);
    } catch (err: any) {
      error(err.message || 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService({
      title: '',
      slug: '',
      shortDesc: '',
      longDesc: '',
      iconName: 'Code',
      benefits: ['Fast turnaround and delivery SLAs', 'Full source code ownership'],
      features: ['Automated test suite integration', 'Secure API endpoints'],
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      status: 'published',
      displayOrder: services.length + 1,
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: ''
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title.trim()) return;
    setIsSaving(true);

    try {
      const cleanSlug = editingService.slug
        ? editingService.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-')
        : editingService.title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');

      const payload = { ...editingService, slug: cleanSlug };

      if (editingService._id) {
        await api.updateAdminService(editingService._id, payload);
        success(`Service "${payload.title}" updated.`);
      } else {
        await api.createAdminService(payload);
        success(`Service "${payload.title}" created.`);
      }

      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      error(err.message || 'Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminService(deleteTarget._id);
      success(`Service "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      fetchServices();
    } catch (err: any) {
      error(err.message || 'Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Services CMS Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Create, edit, and organize public service offerings, tech stacks, deliverables, and SEO tags.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Service
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
        <span className="text-xs font-bold text-text-muted">{services.length} Total Services</span>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="p-6 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between gap-4 group text-left"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Briefcase className="w-5 h-5" />
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    service.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {service.status}
                </span>
              </div>

              <h3 className="text-base font-black text-text-primary tracking-tight group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {service.shortDesc}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {service.techStack?.slice(0, 4).map((tech: string) => (
                  <span key={tech} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface border border-border text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <a
                href={`/services/${service.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-bold text-primary hover:underline flex items-center gap-1"
              >
                /services/{service.slug} <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-surface"
                  title="Edit Service"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(service)}
                  className="p-2 rounded-xl border border-border text-text-secondary hover:text-rose-500 hover:bg-rose-500/10"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  {editingService._id ? 'Edit Service' : 'Add New Service'}
                </h3>
                <span className="text-xs text-text-muted font-mono">
                  {editingService.slug ? `/services/${editingService.slug}` : 'New custom offering'}
                </span>
              </div>
              <button onClick={() => setEditingService(null)} className="p-2 text-text-muted hover:text-text-primary rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Service Name</label>
                  <Input
                    value={editingService.title}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: e.target.value,
                        slug: editingService._id ? editingService.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      })
                    }
                    placeholder="Custom App Development"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-1">URL Slug</label>
                  <Input
                    value={editingService.slug}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="custom-app-development"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Short Description (Cards)</label>
                <Input
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  placeholder="End-to-end native and hybrid mobile apps tailored to your business operations."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Full In-Depth Description</label>
                <Textarea
                  rows={4}
                  value={editingService.longDesc}
                  onChange={(e) => setEditingService({ ...editingService, longDesc: e.target.value })}
                  placeholder="Detailed architectural breakdown, deliverables, SLAs..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                  Technologies Used (comma separated)
                </label>
                <Input
                  value={editingService.techStack?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      techStack: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })
                  }
                  placeholder="React Native, Flutter, Swift, Kotlin, Firebase"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 pt-2">
                <label className="text-xs font-bold text-text-secondary uppercase">Publish Status:</label>
                <select
                  value={editingService.status}
                  onChange={(e) => setEditingService({ ...editingService, status: e.target.value })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-surface border border-border"
                >
                  <option value="published">Published Live</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-text-secondary hover:bg-surface"
                >
                  Cancel
                </button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete Service "${deleteTarget?.title}"?`}
        message="This will delete this service offering and its public URL page. This cannot be undone."
        confirmLabel="Yes, Delete Service"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default ServicesManager;
