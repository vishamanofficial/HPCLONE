'use client';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Users, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

export default function TeamManagerPage() {
  const { success, error } = useToast();
  const [team, setTeam] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.getAdminTeam();
      if (res.success) setTeam(res.team);
    } catch (err: any) {
      error(err.message || 'Failed to fetch team');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      name: '',
      role: '',
      bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      socialLinks: { linkedin: '', twitter: '', github: '' },
      displayOrder: team.length + 1,
      isActive: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem._id) {
        await api.updateAdminTeam(editingItem._id, editingItem);
        success('Team member updated');
      } else {
        await api.createAdminTeam(editingItem);
        success('Team member added');
      }
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminTeam(deleteTarget._id);
      success('Team member removed');
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
            Leadership & Team Members
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage company founders, technical leads, bios, and LinkedIn profiles.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map((m) => (
          <div key={m._id} className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-2xl object-cover border border-border" />
              <div>
                <h4 className="text-sm font-bold text-text-primary">{m.name}</h4>
                <span className="text-[11px] text-primary font-semibold">{m.role}</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">{m.bio}</p>

            <div className="pt-3 border-t border-border flex justify-end gap-1.5">
              <button onClick={() => setEditingItem(m)} className="p-1.5 text-text-secondary hover:text-primary">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setDeleteTarget(m)} className="p-1.5 text-text-secondary hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
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
                {editingItem._id ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setEditingItem(null)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <Input
                placeholder="Full Name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                required
              />
              <Input
                placeholder="Role / Job Title"
                value={editingItem.role}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                required
              />
              <Input
                placeholder="Photo URL"
                value={editingItem.photoUrl}
                onChange={(e) => setEditingItem({ ...editingItem, photoUrl: e.target.value })}
              />
              <Textarea
                rows={3}
                placeholder="Short Professional Bio..."
                value={editingItem.bio}
                onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
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
        title="Remove Team Member?"
        message="This will delete this person from the company leadership page."
        confirmLabel="Yes, Remove"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

