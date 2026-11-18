import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Plus, Edit3, Trash2, Save, X, UserCheck, ShieldAlert } from 'lucide-react';

export const UsersManager: React.FC = () => {
  const { success, error } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const [uRes, rRes] = await Promise.all([api.getAdminUsers(), api.getAdminRoles()]);
      if (uRes.success) setUsers(uRes.users);
      if (rRes.success) setRoles(rRes.roles);
    } catch (err: any) {
      error(err.message || 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser({
      name: '',
      email: '',
      password: '',
      roleId: roles[0]?._id
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingUser._id) {
        await api.updateAdminUser(editingUser._id, editingUser);
        success('User updated');
      } else {
        await api.createAdminUser(editingUser);
        success('User created');
      }
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      error(err.message || 'Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminUser(deleteTarget._id);
      success('User deleted');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      error(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            User Roles & Permissions (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Super Admin, Admin, Editor, and SEO Manager role assignments.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Create Admin User
        </Button>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface/50 border-b border-border text-text-muted font-bold uppercase text-[10px]">
              <th className="py-4 px-6">Name & Email</th>
              <th className="py-4 px-4">Role</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Last Login</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-surface/40 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-text-primary">{u.name}</span>
                    <span className="text-text-muted">{u.email}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-primary/10 text-primary">
                    {u.role?.name || 'Admin'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-bold ${u.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-4 px-4 text-text-muted">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => setDeleteTarget(u)} className="p-2 text-text-muted hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left">
            <h3 className="text-base font-black text-text-primary">Create New User</h3>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <Input
                placeholder="Full Name"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={editingUser.password}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                required
              />
              <select
                value={editingUser.roleId}
                onChange={(e) => setEditingUser({ ...editingUser, roleId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-surface border border-border"
              >
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="secondary" size="sm" type="button" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button variant="gradient" size="sm" type="submit" isLoading={isSaving}>Create User</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User Account?"
        message="This user will lose access to the administration portal immediately."
        confirmLabel="Yes, Delete User"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default UsersManager;
