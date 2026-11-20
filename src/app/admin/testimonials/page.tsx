'use client';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Sparkles, Plus, Edit3, Trash2, Star, Save, X } from 'lucide-react';

export default function TestimonialsManagerPage() {
  const { success, error } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.getAdminTestimonials();
      if (res.success) setTestimonials(res.testimonials);
    } catch (err: any) {
      error(err.message || 'Failed to fetch testimonials');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      clientName: '',
      designation: '',
      company: '',
      content: '',
      rating: 5,
      isFeatured: true,
      displayOrder: testimonials.length + 1
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem._id) {
        await api.updateAdminTestimonial(editingItem._id, editingItem);
        success('Testimonial updated');
      } else {
        await api.createAdminTestimonial(editingItem);
        success('Testimonial added');
      }
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      error(err.message || 'Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminTestimonial(deleteTarget._id);
      success('Testimonial deleted');
      setDeleteTarget(null);
      fetchItems();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Client Testimonials Manager
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage verified client reviews, star ratings, executive designations, and company names.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t._id} className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {t.isFeatured && (
                  <span className="text-[10px] font-black uppercase text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary italic leading-relaxed">"{t.content}"</p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">{t.clientName}</h4>
                <span className="text-[10px] text-text-muted">{t.designation}, {t.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setEditingItem(t)} className="p-1.5 text-text-secondary hover:text-primary">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(t)} className="p-1.5 text-text-secondary hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-base font-black text-text-primary">
                {editingItem._id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setEditingItem(null)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <Input
                placeholder="Client Name (e.g. Tariq Al-Mansoor)"
                value={editingItem.clientName}
                onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Designation (e.g. CTO)"
                  value={editingItem.designation}
                  onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                  required
                />
                <Input
                  placeholder="Company Name"
                  value={editingItem.company}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  required
                />
              </div>
              <Textarea
                rows={3}
                placeholder="Testimonial quote text..."
                value={editingItem.content}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                required
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="secondary" size="sm" type="button" onClick={() => setEditingItem(null)}>Cancel</Button>
                <Button variant="gradient" size="sm" type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message="This will remove this testimonial review from the site."
        confirmLabel="Yes, Delete"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

