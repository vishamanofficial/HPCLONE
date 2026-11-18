import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { FileText, Search, RefreshCw, Clock, User, Shield } from 'lucide-react';

export const AuditLogsViewer: React.FC = () => {
  const { error } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAuditLogs({ limit: 100 });
      if (res.success) setLogs(res.logs);
    } catch (err: any) {
      error(err.message || 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-left max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Security & Activity Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Tamper-evident logs of logins, page edits, revisions, lead actions, and settings updates.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:bg-surface"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface/50 border-b border-border text-text-muted font-bold uppercase text-[10px]">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Resource</th>
                <th className="py-4 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-text-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-text-primary">{log.action}</td>
                  <td className="py-4 px-4 font-semibold text-text-secondary">{log.userName}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-primary/10 text-primary">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-text-muted">{log.resource}</td>
                  <td className="py-4 px-6 text-text-secondary text-[11px] truncate max-w-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AuditLogsViewer;
