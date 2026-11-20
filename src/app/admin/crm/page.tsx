'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  DollarSign,
  Briefcase,
  ChevronRight,
  Send,
  X,
  FileSpreadsheet,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'new', label: '1. New Lead', color: 'border-blue-500 bg-blue-500/10 text-blue-500' },
  { id: 'contacted', label: '2. Contacted', color: 'border-amber-500 bg-amber-500/10 text-amber-500' },
  { id: 'qualified', label: '3. Qualified', color: 'border-purple-500 bg-purple-500/10 text-purple-500' },
  { id: 'proposal_sent', label: '4. Proposal Sent', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-500' },
  { id: 'negotiation', label: '5. Negotiation', color: 'border-orange-500 bg-orange-500/10 text-orange-500' },
  { id: 'converted', label: '6. Converted (Won)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-500' },
  { id: 'lost', label: '7. Lost', color: 'border-slate-500 bg-slate-500/10 text-slate-400' },
  { id: 'spam', label: '8. Spam', color: 'border-rose-500 bg-rose-500/10 text-rose-500' }
];

function CrmPipelineInternal() {
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [leads, setLeads] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [isLoading, setIsLoading] = useState(true);

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Delete lead state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCrmData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, dashRes] = await Promise.all([
        api.getAdminLeads({ limit: 100 }),
        api.getCrmDashboard()
      ]);

      if (leadsRes.success) setLeads(leadsRes.leads);
      if (dashRes.success) setMetrics(dashRes.crmMetrics);

      // Auto-open lead if passed in URL
      // using next searchParams directly
      const leadIdFromUrl = searchParams.get('leadId');
      if (leadIdFromUrl && leadsRes.leads) {
        const found = leadsRes.leads.find((l: any) => l._id === leadIdFromUrl);
        if (found) setSelectedLead(found);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load CRM leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, [searchParams]);

  const handleStageChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await api.updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        success(`Lead moved to stage: ${newStatus}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update stage');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedLead) return;
    setIsAddingNote(true);

    try {
      const res = await api.addLeadNote(selectedLead._id, noteText);
      if (res.success && res.lead) {
        setSelectedLead(res.lead);
        setLeads((prev) =>
          prev.map((l) => (l._id === res.lead._id ? res.lead : l))
        );
        setNoteText('');
        success('Internal note added');
      }
    } catch (err: any) {
      error(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminLead(deleteTarget._id);
      success(`Lead "${deleteTarget.fullName}" deleted`);
      setDeleteTarget(null);
      if (selectedLead && selectedLead._id === deleteTarget._id) {
        setSelectedLead(null);
      }
      fetchCrmData();
    } catch (err: any) {
      error(err.message || 'Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.companyName && l.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || l.priority === priorityFilter;
    return matchesSearch && matchesSource && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Mini CRM & Lead Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Capture, qualify, follow up, and track conversions for all incoming agency proposals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'board' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Pipeline Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'table' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Table View
            </button>
          </div>

          <a href={api.getLeadExportUrl()} target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download className="w-4 h-4 text-primary" />}
            >
              Export CSV
            </Button>
          </a>
        </div>
      </div>

      {/* CRM Conversion Funnel Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-text-muted uppercase">Total Leads</span>
          <span className="text-2xl font-black text-text-primary">{metrics?.totalLeads || 0}</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-blue-500 uppercase">New Inquiries</span>
          <span className="text-2xl font-black text-blue-500">{metrics?.newLeads || 0}</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-purple-500 uppercase">Qualified</span>
          <span className="text-2xl font-black text-purple-500">{metrics?.qualifiedLeads || 0}</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-indigo-500 uppercase">Proposals Sent</span>
          <span className="text-2xl font-black text-indigo-500">{metrics?.proposalSentLeads || 0}</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Converted (Won)</span>
          <span className="text-2xl font-black text-emerald-500">{metrics?.convertedLeads || 0}</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-text-muted uppercase">Conversion Rate</span>
          <span className="text-2xl font-black text-primary">{metrics?.conversionRate || '0%'}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-surface border border-border text-text-secondary cursor-pointer"
          >
            <option value="all">All Lead Sources</option>
            <option value="homepage_blueprint">Homepage Blueprint</option>
            <option value="contact_page">Contact Page</option>
            <option value="cost_calculator">Cost Calculator</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-surface border border-border text-text-secondary cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, phone, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Pipeline Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 items-start min-h-[600px]">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 bg-card border border-border rounded-3xl p-4 flex flex-col gap-3 shadow-sm"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full border ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-text-muted">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="flex flex-col gap-3 min-h-[150px]">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead) => (
                      <div
                        key={lead._id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2.5 text-left group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors leading-tight">
                            {lead.fullName}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                              lead.priority === 'urgent'
                                ? 'bg-rose-500/10 text-rose-500'
                                : lead.priority === 'high'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-slate-500/10 text-text-muted'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>

                        <div className="text-[11px] text-text-secondary leading-snug">
                          {lead.interestedService || 'Software Scoping'}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-text-muted border-t border-border/50 pt-2 mt-1">
                          <span className="font-semibold text-primary">{lead.budget || 'N/A'}</span>
                          <span>{new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-[11px] text-text-muted italic border-2 border-dashed border-border/60 rounded-2xl">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface/50 border-b border-border text-text-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Lead Details</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Service & Budget</th>
                  <th className="py-4 px-4">Stage</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-4">Source</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-surface/40 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-text-primary">{lead.fullName}</span>
                        {lead.companyName && (
                          <span className="text-[11px] text-text-muted">{lead.companyName}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-secondary">
                      <div>{lead.email}</div>
                      <div className="text-[11px] font-mono">{lead.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-text-primary">{lead.interestedService || 'General'}</div>
                      <div className="text-primary font-semibold">{lead.budget || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStageChange(lead._id, e.target.value)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface border border-border cursor-pointer"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 font-bold capitalize text-text-secondary">{lead.priority}</td>
                    <td className="py-4 px-4 text-text-muted text-[11px]">{lead.source}</td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDeleteTarget(lead)}
                        className="p-2 text-text-muted hover:text-rose-500 rounded-lg"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail & Notes Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-card border-l border-border p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl text-left animate-in slide-in-from-right duration-300">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                    Lead Profile
                  </span>
                  <h3 className="text-xl font-black text-text-primary mt-0.5">{selectedLead.fullName}</h3>
                  {selectedLead.companyName && (
                    <span className="text-xs text-text-muted">{selectedLead.companyName}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteTarget(selectedLead)}
                    className="p-2 rounded-xl border border-border text-text-muted hover:text-rose-500 hover:bg-rose-500/10"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 text-text-muted hover:text-text-primary rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Selector Bar */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary">Pipeline Stage</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStageChange(selectedLead._id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-card border border-border text-primary cursor-pointer"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                  </span>
                  <a href={`mailto:${selectedLead.email}`} className="text-xs font-bold text-text-primary hover:text-primary transition-colors">
                    {selectedLead.email}
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-primary" /> Phone & WhatsApp
                  </span>
                  <a href={`tel:${selectedLead.phone}`} className="text-xs font-bold text-text-primary hover:text-primary transition-colors font-mono">
                    {selectedLead.countryCode} {selectedLead.phone}
                  </a>
                </div>
              </div>

              {/* Requirements & Budget */}
              <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-text-muted">Interested Service</span>
                  <span className="text-xs font-bold text-primary">{selectedLead.budget || 'Not specified'}</span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">{selectedLead.interestedService}</h4>
                {selectedLead.message && (
                  <p className="text-xs text-text-secondary leading-relaxed mt-2 pt-2 border-t border-border/40">
                    "{selectedLead.message}"
                  </p>
                )}
              </div>

              {/* Calculator Breakdown if available */}
              {selectedLead.calculatorDetails && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                    App Cost Calculator Snapshot
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                    <div>Platform: <strong className="text-text-primary">{selectedLead.calculatorDetails.platform}</strong></div>
                    <div>Category: <strong className="text-text-primary">{selectedLead.calculatorDetails.category}</strong></div>
                    <div>Estimated Ballpark: <strong className="text-primary">${selectedLead.calculatorDetails.estimatedCost?.toLocaleString()}</strong></div>
                    <div>Timeline: <strong className="text-text-primary">{selectedLead.calculatorDetails.timelineWeeks?.min}-{selectedLead.calculatorDetails.timelineWeeks?.max} wks</strong></div>
                  </div>
                </div>
              )}

              {/* Internal Notes Thread */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary">
                  Internal Team Notes ({selectedLead.notes?.length || 0})
                </h4>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <Input
                    placeholder="Add follow-up notes, call logs, next steps..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <Button type="submit" variant="primary" size="sm" isLoading={isAddingNote}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>

                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface border border-border text-xs flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] text-text-muted">
                          <span className="font-bold text-text-primary">{note.addedBy}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted italic">No internal notes yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lead Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete Lead "${deleteTarget?.fullName}"?`}
        message="This will permanently delete this lead record and all internal activity notes. This cannot be undone."
        confirmLabel="Yes, Delete Lead"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteLead}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};



export default function CrmPipelinePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">Loading CRM Pipeline...</div>}>
      <CrmPipelineInternal />
    </Suspense>
  );
}
