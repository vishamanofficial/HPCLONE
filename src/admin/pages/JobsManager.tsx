import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { UserCheck, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

export const JobsManager: React.FC = () => {
  const { success, error } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.getPublicJobs();
      if (res.success) setJobs(res.jobs);
    } catch (err: any) {
      error(err.message || 'Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      title: '',
      type: 'Full-time (Remote / Noida Office)',
      location: 'Noida Office / Remote',
      experience: '3+ Years',
      description: '',
      department: 'Engineering',
      displayOrder: jobs.length + 1,
      isActive: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem._id) {
        await api.updateAdminService(editingItem._id, editingItem); // fallback or dedicated
        success('Job updated');
      } else {
        await api.createAdminService(editingItem);
        success('Job posted');
      }
      setEditingItem(null);
      fetchJobs();
    } catch (err: any) {
      error(err.message || 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Careers & Open Positions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Publish job openings on the public /career page.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase text-primary px-2 py-0.5 rounded-full bg-primary/10 w-fit">
                {job.department || 'Engineering'}
              </span>
              <h3 className="text-base font-black text-text-primary">{job.title}</h3>
              <span className="text-xs text-text-muted">{job.type} • {job.experience}</span>
              <p className="text-xs text-text-secondary leading-relaxed mt-1 line-clamp-3">{job.description}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-500">Active</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setEditingItem(job)} className="p-1.5 text-text-secondary hover:text-primary">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default JobsManager;
