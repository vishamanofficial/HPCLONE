import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Globe, Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react';

export const NavigationManager: React.FC = () => {
  const { success, error } = useToast();
  const [menus, setMenus] = useState<any[]>([]);
  const [activeLocation, setActiveLocation] = useState<string>('header');
  const [isSaving, setIsSaving] = useState(false);

  const fetchMenus = async () => {
    try {
      const res = await api.getAdminNavigation();
      if (res.success) setMenus(res.menus);
    } catch (err: any) {
      error(err.message || 'Failed to fetch navigation');
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const currentMenu = menus.find((m) => m.location === activeLocation) || {
    location: activeLocation,
    title: activeLocation,
    items: []
  };

  const handleAddItem = () => {
    const newItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      url: '/',
      order: currentMenu.items.length + 1
    };
    const updatedItems = [...(currentMenu.items || []), newItem];
    setMenus((prev) =>
      prev.map((m) => (m.location === activeLocation ? { ...m, items: updatedItems } : m))
    );
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...currentMenu.items];
    updatedItems[index][field] = value;
    setMenus((prev) =>
      prev.map((m) => (m.location === activeLocation ? { ...m, items: updatedItems } : m))
    );
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = currentMenu.items.filter((_: any, i: number) => i !== index);
    setMenus((prev) =>
      prev.map((m) => (m.location === activeLocation ? { ...m, items: updatedItems } : m))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentMenu.items.length) return;
    const items = [...currentMenu.items];
    const [moved] = items.splice(index, 1);
    items.splice(targetIdx, 0, moved);
    setMenus((prev) =>
      prev.map((m) => (m.location === activeLocation ? { ...m, items } : m))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateAdminNavigation({
        location: activeLocation,
        items: currentMenu.items,
        title: currentMenu.title
      });
      success(`Navigation for ${activeLocation} saved!`);
      fetchMenus();
    } catch (err: any) {
      error(err.message || 'Failed to save navigation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Navigation Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Configure header mega-menu links, footer columns, URLs, and labels.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Save Menu
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-bold gap-2">
        {[
          { id: 'header', label: 'Main Header Menu' },
          { id: 'footer_company', label: 'Footer: Our Company' },
          { id: 'footer_recent_work', label: 'Footer: Recent Work' },
          { id: 'footer_key_offerings', label: 'Footer: Key Offerings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveLocation(tab.id)}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeLocation === tab.id
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Menu Items ({currentMenu.items?.length || 0})
          </span>
          <Button variant="secondary" size="sm" onClick={handleAddItem} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {currentMenu.items && currentMenu.items.length > 0 ? (
            currentMenu.items.map((item: any, idx: number) => (
              <div key={item.id || idx} className="p-3.5 rounded-2xl bg-surface border border-border flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="text-text-muted hover:text-text-primary disabled:opacity-20"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === currentMenu.items.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="text-text-muted hover:text-text-primary disabled:opacity-20"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Menu Label"
                    value={item.label}
                    onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                  />
                  <Input
                    placeholder="Target URL (e.g. /about)"
                    value={item.url}
                    onChange={(e) => handleItemChange(idx, 'url', e.target.value)}
                  />
                </div>

                <button onClick={() => handleDeleteItem(idx)} className="p-2 text-text-muted hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-text-muted">No items in this menu. Click "Add Link".</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NavigationManager;
