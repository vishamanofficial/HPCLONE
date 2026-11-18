import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { HelpCircle, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

export const FaqManager: React.FC = () => {
  const { success, error } = useToast();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.getAdminFAQs();
      if (res.success) setFaqs(res.faqs);
    } catch (err: any) {
      error(err.message || 'Failed to fetch FAQs');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      question: '',
      answer: '',
      category: 'general',
      relatedServiceSlug: '',
      displayOrder: faqs.length + 1,
      isActive: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem._id) {
        await api.updateAdminFAQ(editingItem._id, editingItem);
        success('FAQ updated');
      } else {
        await api.createAdminFAQ(editingItem);
        success('FAQ created');
      }
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      error(err.message || 'Failed to save FAQ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminFAQ(deleteTarget._id);
      success('FAQ deleted');
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
            Frequently Asked Questions CMS
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Centralized repository for questions, answers, service assignments, and FAQPage schema support.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add FAQ
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq._id} className="p-5 rounded-2xl bg-card border border-border flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-primary px-2 py-0.5 rounded-full bg-primary/10">
                  {faq.category}
                </span>
                <h4 className="text-sm font-bold text-text-primary">{faq.question}</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pl-1">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => setEditingItem(faq)} className="p-1.5 text-text-secondary hover:text-primary">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteTarget(faq)} className="p-1.5 text-text-secondary hover:text-rose-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-base font-black text-text-primary">
                {editingItem._id ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setEditingItem(null)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <Input
                placeholder="Question (e.g. Do I own the source code?)"
                value={editingItem.question}
                onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                required
              />
              <Textarea
                rows={4}
                placeholder="Detailed Answer..."
                value={editingItem.answer}
                onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
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
        title="Delete FAQ Item?"
        message="This question will be removed from all public pages."
        confirmLabel="Yes, Delete"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default FaqManager;
